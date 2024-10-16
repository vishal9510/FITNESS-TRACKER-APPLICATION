const express = require('express');
const {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    updateGoalProgress,

} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new goal
router.post('/', protect, createGoal);

// Get all goals of the logged-in user
router.get('/', protect, getGoals);

// Update a specific goal
router.put('/:goalId', protect, updateGoal);


// Update progress of a goal
router.put('/:goalId/progress', protect, updateGoalProgress);

// Delete a specific goal
router.delete('/:goalId', protect, deleteGoal);

module.exports = router;
