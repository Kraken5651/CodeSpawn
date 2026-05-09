/**
 * Authentication Controller
 * Handles user registration, login, and token management
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, UserProfile } = require('../models');
const { AppError } = require('../middleware/errorHandler');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

const register = async (req, res, next) => {
  try {
    const { email, username, password, first_name, last_name } = req.body;

    // Validate input
    if (!email || !username || !password) {
      throw new AppError('Email, username, and password are required', 422, 'VALIDATION_ERROR');
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409, 'CONFLICT');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      username,
      password_hash,
      first_name,
      last_name
    });

    // Create user profile
    await UserProfile.create({
      user_id: user.id
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          created_at: user.created_at
        },
        token: accessToken,
        refreshToken: refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 422, 'VALIDATION_ERROR');
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    // Update last login
    user.last_login_at = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        },
        token: accessToken,
        refreshToken: refreshToken,
        expiresIn: 3600
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // TODO: Invalidate token in Redis if needed
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token required', 422, 'VALIDATION_ERROR');
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        throw new AppError('User not found', 404, 'NOT_FOUND');
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

      res.json({
        success: true,
        data: {
          token: accessToken,
          refreshToken: newRefreshToken,
          expiresIn: 3600
        }
      });
    } catch (err) {
      throw new AppError('Invalid refresh token', 401, 'UNAUTHORIZED');
    }
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        association: 'profile'
      }]
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          created_at: user.created_at
        },
        profile: user.profile
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser
};
