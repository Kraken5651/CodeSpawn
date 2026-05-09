const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const problemRoutes = require('./problems');
const submissionRoutes = require('./submissions');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/problems', problemRoutes);
router.use('/submissions', submissionRoutes);

// TODO: Add additional routes as they are created
// const discussionRoutes = require('./discussions');
// const achievementRoutes = require('./achievements');
// const leaderboardRoutes = require('./leaderboards');
// const adminRoutes = require('./admin');
// router.use('/discussions', discussionRoutes);
// router.use('/achievements', achievementRoutes);
// router.use('/leaderboards', leaderboardRoutes);
// router.use('/admin', adminRoutes);

module.exports = router;
