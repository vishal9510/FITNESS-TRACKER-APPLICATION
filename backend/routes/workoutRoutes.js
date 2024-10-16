const express = require('express');
const { createWorkout, getWorkouts, updateWorkout, deleteWorkout, getWorkoutStats } = require('../controllers/workoutController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new workout log
router.post('/', protect, admin, createWorkout);

// Get all workouts for a user
router.get('/', protect, getWorkouts);

// Update a specific workout log
router.put('/:id', protect, updateWorkout);

// Delete a specific workout log
router.delete('/:id', protect, deleteWorkout);


// Get workout statistics by date range, activity type, and goal achievement status
router.get('/workouts', protect, getWorkoutStats);

module.exports = router;
