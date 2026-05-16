/**
 * Submission Controller
 * Handles code submission processing and results
 */

const { Submission, Problem, User, UserProfile, Language, TestCase } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { judgeSubmission } = require('../services/submissionJudge');

const getSubmissionUserId = async (req) => {
  if (req.user?.id) {
    return req.user.id;
  }

  const [demoUser] = await User.findOrCreate({
    where: { email: 'demo@codespawn.local' },
    defaults: {
      username: 'demo_runner',
      password_hash: 'demo-user-no-login',
      role: 'user'
    }
  });

  await UserProfile.findOrCreate({
    where: { user_id: demoUser.id },
    defaults: { user_id: demoUser.id }
  });

  return demoUser.id;
};

const submitCode = async (req, res, next) => {
  try {
    const { problem_id, code, language_id, language_slug } = req.body;

    // Validate input
    if (!problem_id || !code || (!language_id && !language_slug)) {
      throw new AppError('Problem ID, code, and language are required', 422, 'VALIDATION_ERROR');
    }

    // Check problem exists
    const problem = await Problem.findByPk(problem_id, {
      include: [
        { association: 'language' }
      ]
    });
    if (!problem) {
      throw new AppError('Problem not found', 404, 'NOT_FOUND');
    }

    const language = language_id
      ? await Language.findByPk(language_id)
      : await Language.findOne({ where: { slug: language_slug } });
    if (!language) {
      throw new AppError('Language not found', 404, 'NOT_FOUND');
    }

    const userId = await getSubmissionUserId(req);

    // Create submission record
    const submission = await Submission.create({
      user_id: userId,
      problem_id,
      code,
      language_id: language.id,
      status: 'PENDING'
    });

    await submission.update({
      status: 'RUNNING',
      started_at: new Date()
    });

    const testCases = await TestCase.findAll({
      where: { problem_id },
      order: [['created_at', 'ASC']]
    });

    const result = await judgeSubmission({
      code,
      problem,
      language,
      testCases
    });

    await submission.update({
      ...result,
      completed_at: new Date()
    });

    problem.total_attempts += 1;
    if (result.is_accepted) {
      problem.total_solved += 1;
    }
    problem.acceptance_rate = problem.total_attempts > 0
      ? Number(((problem.total_solved / problem.total_attempts) * 100).toFixed(2))
      : 0;
    await problem.save();

    if (result.is_accepted) {
      await awardAcceptedSubmission({ submission, problem });
    }

    res.status(201).json({
      success: true,
      message: 'Submission executed',
      data: {
        submission
      }
    });
  } catch (error) {
    next(error);
  }
};

const awardAcceptedSubmission = async ({ submission, problem }) => {
  const userProfile = await UserProfile.findByPk(submission.user_id);

  if (!userProfile) {
    return;
  }

  const xpReward = problem.xp_reward || 50;
  userProfile.total_xp += xpReward;
  userProfile.level = Math.floor(userProfile.total_xp / 100) + 1;

  const today = new Date().toDateString();
  const lastSubmitDate = userProfile.last_submission_date?.toDateString();

  if (lastSubmitDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastSubmitDate === yesterday) {
      userProfile.current_streak_count += 1;
    } else {
      userProfile.current_streak_count = 1;
    }

    if (userProfile.current_streak_count > userProfile.max_streak_count) {
      userProfile.max_streak_count = userProfile.current_streak_count;
    }

    userProfile.last_submission_date = new Date();
  }

  userProfile.problems_solved += 1;

  await userProfile.save();
};

const getSubmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findByPk(id, {
      include: [
        { association: 'user', attributes: ['id', 'username'] },
        { association: 'problem', attributes: ['id', 'title'] },
        { association: 'language', attributes: ['id', 'name'] }
      ]
    });

    if (!submission) {
      throw new AppError('Submission not found', 404, 'NOT_FOUND');
    }

    // Check authorization - only user who submitted or admin can view
    if (submission.user_id !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Unauthorized', 403, 'FORBIDDEN');
    }

    res.json({
      success: true,
      data: { submission }
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissionsByProblem = async (req, res, next) => {
  try {
    const { problem_id } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    if (!req.user?.id) {
      return res.json({
        success: true,
        data: {
          submissions: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0
          }
        }
      });
    }

    const offset = (page - 1) * limit;
    const where = {
      user_id: req.user.id,
      problem_id
    };

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    const { count, rows: submissions } = await Submission.findAndCountAll({
      where,
      include: [
        { association: 'language', attributes: ['id', 'name'] }
      ],
      order: [['submitted_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// This would be called by the job worker after code execution completes
const updateSubmissionResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      status,
      passed_tests,
      total_tests,
      execution_time_ms,
      memory_used_mb,
      is_accepted,
      stdout_output,
      stderr_output,
      error_message
    } = req.body;

    const submission = await Submission.findByPk(id, {
      include: [
        { association: 'problem' }
      ]
    });

    if (!submission) {
      throw new AppError('Submission not found', 404, 'NOT_FOUND');
    }

    // Update submission
    await submission.update({
      status,
      passed_tests,
      total_tests,
      execution_time_ms,
      memory_used_mb,
      is_accepted,
      stdout_output,
      stderr_output,
      error_message,
      completed_at: new Date()
    });

    // If accepted, update user profile and problem stats
    if (is_accepted) {
      const userProfile = await UserProfile.findByPk(submission.user_id);

      if (userProfile) {
        // Award XP
        const xpReward = submission.problem.xp_reward || 50;
        userProfile.total_xp += xpReward;

        // Update level based on XP (simple calculation: level = (total_xp / 100) + 1)
        userProfile.level = Math.floor(userProfile.total_xp / 100) + 1;

        // Update streak
        const today = new Date().toDateString();
        const lastSubmitDate = userProfile.last_submission_date?.toDateString();

        if (lastSubmitDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          
          if (lastSubmitDate === yesterday) {
            userProfile.current_streak_count += 1;
          } else {
            userProfile.current_streak_count = 1;
          }

          if (userProfile.current_streak_count > userProfile.max_streak_count) {
            userProfile.max_streak_count = userProfile.current_streak_count;
          }

          userProfile.last_submission_date = new Date();
        }

        // Update problem solved count
        userProfile.problems_solved += 1;

        await userProfile.save();
      }

      // Update problem stats
      submission.problem.total_solved += 1;
      await submission.problem.save();
    }

    res.json({
      success: true,
      data: { submission }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitCode,
  getSubmissionById,
  getSubmissionsByProblem,
  updateSubmissionResult
};
