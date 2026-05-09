/**
 * User Controller
 * Handles user profile management and social features
 */

const { User, UserProfile, Submission, Problem } = require('../models');
const { AppError } = require('../middleware/errorHandler');

const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [{
        association: 'profile'
      }],
      attributes: {
        exclude: ['password_hash']
      }
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, bio, location, website_url, preferred_language, theme } = req.body;

    // Only allow users to update their own profile
    if (req.user.id !== id && req.user.role !== 'admin') {
      throw new AppError('Unauthorized', 403, 'FORBIDDEN');
    }

    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Update user
    await user.update({
      first_name,
      last_name,
      bio,
      location,
      website_url,
      preferred_language,
      theme
    });

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

const getUserSolvedProblems = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: submissions } = await Submission.findAndCountAll({
      where: {
        user_id: id,
        is_accepted: true
      },
      include: [{
        association: 'problem',
        attributes: ['id', 'title', 'slug', 'difficulty_id']
      }],
      order: [['submitted_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        problems: submissions,
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

const getUserStreak = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await UserProfile.findByPk(id);

    if (!profile) {
      throw new AppError('User profile not found', 404, 'NOT_FOUND');
    }

    res.json({
      success: true,
      data: {
        current_streak: profile.current_streak_count,
        max_streak: profile.max_streak_count,
        streak_start_date: profile.current_streak_start_date,
        last_submission_date: profile.last_submission_date
      }
    });
  } catch (error) {
    next(error);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const { period = 'weekly', page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;

    // TODO: Implement period-based XP calculation from database
    // For now, fetch top users by total XP

    const { count, rows: leaderboard } = await UserProfile.findAndCountAll({
      order: [['total_xp', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [{
        association: 'user',
        attributes: ['id', 'username', 'profile_picture_url']
      }]
    });

    res.json({
      success: true,
      data: {
        leaderboard,
        period,
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

const followUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      throw new AppError('Cannot follow yourself', 400, 'BAD_REQUEST');
    }

    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Get current user
    const currentUser = await User.findByPk(req.user.id);

    // Add to following list
    await currentUser.addFollowing(user);

    res.status(201).json({
      success: true,
      message: 'Now following user'
    });
  } catch (error) {
    next(error);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Get current user
    const currentUser = await User.findByPk(req.user.id);

    // Remove from following list
    await currentUser.removeFollowing(user);

    res.json({
      success: true,
      message: 'Unfollowed user'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserSolvedProblems,
  getUserStreak,
  getLeaderboard,
  followUser,
  unfollowUser
};
