const express = require('express');
const {
    getCaloriesBurnedOverTime,
    getWorkoutTypes,
    getGoalAchievement,
} = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Get calories burned over time
router.get('/calories', protect, getCaloriesBurnedOverTime);

// Get types of workouts
router.get('/workout-types', protect, getWorkoutTypes);

// Get goal achievement status
router.get('/goals', protect, getGoalAchievement);

module.exports = router;
