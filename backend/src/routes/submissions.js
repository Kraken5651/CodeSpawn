/**
 * Submission Routes
 */

const express = require('express');
const submissionController = require('../controllers/submissionController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Submit code (protected)
router.post('/', authMiddleware, submissionController.submitCode);

// Get submissions for a problem (protected)
router.get('/problem/:problem_id', authMiddleware, submissionController.getSubmissionsByProblem);

// Get submission by ID (protected)
router.get('/:id', authMiddleware, submissionController.getSubmissionById);

module.exports = router;
