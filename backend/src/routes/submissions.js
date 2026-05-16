/**
 * Submission Routes
 */

const express = require('express');
const submissionController = require('../controllers/submissionController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Submit code. Uses authenticated user when present, otherwise falls back to demo mode.
router.post('/', optionalAuth, submissionController.submitCode);

// Get submissions for a problem. Anonymous users receive an empty history.
router.get('/problem/:problem_id', optionalAuth, submissionController.getSubmissionsByProblem);

// Get submission by ID (protected)
router.get('/:id', authMiddleware, submissionController.getSubmissionById);

module.exports = router;
