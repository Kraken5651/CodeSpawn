/**
 * Submission Controller
 * Handles code submission processing and results
 */

const { Submission, Problem, UserProfile } = require('../models');
const { AppError } = require('../middleware/errorHandler');

const submitCode = async (req, res, next) => {
  try {
    const { problem_id, code, language_id } = req.body;

    // Validate input
    if (!problem_id || !code || !language_id) {
      throw new AppError('Problem ID, code, and language ID are required', 422, 'VALIDATION_ERROR');
    }

    // Check problem exists
    const problem = await Problem.findByPk(problem_id);
    if (!problem) {
      throw new AppError('Problem not found', 404, 'NOT_FOUND');
    }

    // Create submission record
    const submission = await Submission.create({
      user_id: req.user.id,
      problem_id,
      code,
      language_id,
      status: 'PENDING'
    });

    // TODO: Queue submission for execution in job queue (Bull)
    // For now, just mark as created

    res.status(202).json({
      success: true,
      message: 'Submission queued for execution',
      data: {
        submission: {
          id: submission.id,
          status: submission.status,
          submitted_at: submission.submitted_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
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
