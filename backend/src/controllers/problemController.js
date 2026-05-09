/**
 * Problem Controller
 * Handles problem retrieval, listing, and management
 */

const { Problem, Language, DifficultyLevel, Submission, TestCase } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

const getAllProblems = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, difficulty, language, search, sort_by = 'trending' } = req.query;

    const offset = (page - 1) * limit;
    const where = { is_published: true };

    // Filter by difficulty
    if (difficulty) {
      const diffLevel = await DifficultyLevel.findOne({ where: { name: difficulty } });
      if (diffLevel) {
        where.difficulty_id = diffLevel.id;
      }
    }

    // Filter by language
    if (language) {
      const lang = await Language.findOne({ where: { slug: language } });
      if (lang) {
        where.language_id = lang.id;
      }
    }

    // Search by title or description
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Determine sort order
    let order = [['created_at', 'DESC']];
    if (sort_by === 'popular') {
      order = [['total_attempts', 'DESC']];
    } else if (sort_by === 'difficulty') {
      order = [['difficulty_id', 'ASC']];
    }

    const { count, rows: problems } = await Problem.findAndCountAll({
      where,
      include: [
        { association: 'difficulty', attributes: ['id', 'name', 'xp_reward'] },
        { association: 'language', attributes: ['id', 'name'] }
      ],
      order,
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        problems,
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

const getProblemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findByPk(id, {
      include: [
        { association: 'difficulty' },
        { association: 'language' },
        {
          association: 'test_cases',
          where: { is_hidden: false },
          required: false
        }
      ]
    });

    if (!problem) {
      throw new AppError('Problem not found', 404, 'NOT_FOUND');
    }

    // Increment view count
    problem.view_count += 1;
    await problem.save();

    res.json({
      success: true,
      data: { problem }
    });
  } catch (error) {
    next(error);
  }
};

const createProblem = async (req, res, next) => {
  try {
    // Check admin permission
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      throw new AppError('Only admins can create problems', 403, 'FORBIDDEN');
    }

    const {
      title,
      slug,
      description,
      difficulty_id,
      language_id,
      boilerplate_code,
      solution_code,
      solution_explanation,
      time_limit_seconds,
      memory_limit_mb,
      estimated_time_minutes,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !slug || !description || !difficulty_id || !language_id) {
      throw new AppError('Missing required fields', 422, 'VALIDATION_ERROR');
    }

    // Check if slug already exists
    const existingProblem = await Problem.findOne({ where: { slug } });
    if (existingProblem) {
      throw new AppError('Problem slug already exists', 409, 'CONFLICT');
    }

    const problem = await Problem.create({
      title,
      slug,
      description,
      difficulty_id,
      language_id,
      boilerplate_code,
      solution_code,
      solution_explanation,
      time_limit_seconds,
      memory_limit_mb,
      estimated_time_minutes,
      created_by: req.user.id,
      is_published: false
    });

    res.status(201).json({
      success: true,
      data: { problem }
    });
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check admin permission
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      throw new AppError('Only admins can update problems', 403, 'FORBIDDEN');
    }

    const problem = await Problem.findByPk(id);

    if (!problem) {
      throw new AppError('Problem not found', 404, 'NOT_FOUND');
    }

    // Update fields
    await problem.update(req.body);

    res.json({
      success: true,
      data: { problem }
    });
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check admin permission
    if (req.user.role !== 'admin') {
      throw new AppError('Only admins can delete problems', 403, 'FORBIDDEN');
    }

    const problem = await Problem.findByPk(id);

    if (!problem) {
      throw new AppError('Problem not found', 404, 'NOT_FOUND');
    }

    // Soft delete
    await problem.destroy();

    res.json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
};
