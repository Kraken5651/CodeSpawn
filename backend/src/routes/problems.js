/**
 * Problem Routes
 */

const express = require('express');
const problemController = require('../controllers/problemController');
const { authMiddleware, moderatorOrAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all problems (public)
router.get('/', problemController.getAllProblems);

// Create problem (protected - admin/moderator only)
router.post('/', authMiddleware, moderatorOrAdmin, problemController.createProblem);

// Get problem by ID (public)
router.get('/:id', problemController.getProblemById);

// Update problem (protected - admin/moderator only)
router.put('/:id', authMiddleware, moderatorOrAdmin, problemController.updateProblem);

// Delete problem (protected - admin only)
router.delete('/:id', authMiddleware, problemController.deleteProblem);

module.exports = router;
