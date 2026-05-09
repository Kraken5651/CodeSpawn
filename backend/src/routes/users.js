/**
 * User Routes
 */

const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Get leaderboard (public)
router.get('/leaderboard', userController.getLeaderboard);

// Get user profile (public)
router.get('/:id', userController.getUserProfile);

// Update user profile (protected)
router.put('/:id', authMiddleware, userController.updateUserProfile);

// Get user's solved problems (protected)
router.get('/:id/problems', authMiddleware, userController.getUserSolvedProblems);

// Get user's streak (public)
router.get('/:id/streak', userController.getUserStreak);

// Follow user (protected)
router.post('/:id/follow', authMiddleware, userController.followUser);

// Unfollow user (protected)
router.delete('/:id/follow', authMiddleware, userController.unfollowUser);

module.exports = router;
