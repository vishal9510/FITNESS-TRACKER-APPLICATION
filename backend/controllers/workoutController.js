const Workout = require('../model/workout.model');
const Goal = require('../model/goal.model');

// @desc    Create a new workout log
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res) => {
    const { exercises } = req.body;


    if (!exercises || exercises.length === 0) {
        return res.status(400).json({ message: 'Please provide workout exercises' });
    }

    const workout = new Workout({
        user: req.user._id,
        exercises,
    });

    const createdWorkout = await workout.save();
    res.status(201).json(createdWorkout);
};

// @desc    Get all workouts of a user
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
    const workouts = await Workout.find({ user: req.user._id });
    res.json(workouts);
};



// @desc    Update an existing workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (workout && workout.user.toString() === req.user._id.toString()) {
        workout.exercises = req.body.exercises || workout.exercises;  // Update exercises if provided
        workout.date = req.body.date || workout.date;  // Update the date if provided

        const updatedWorkout = await workout.save();
        res.json(updatedWorkout);
    } else {
        res.status(404).json({ message: 'Workout not found or not authorized' });
    }
};

// @desc    Delete a workout log
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (workout && workout.user.toString() === req.user._id.toString()) {
        await workout.remove();
        res.json({ message: 'Workout removed' });
    } else {
        res.status(404).json({ message: 'Workout not found or not authorized' });
    }
};




// @desc    Generate workout statistics by date range, activity type, and goal status
// @route   GET /api/stats/workouts
// @access  Private
const getWorkoutStats = async (req, res) => {
    try {
        const { startDate, endDate, activityType } = req.query;  // Date range and activity type filter

        // Parse the dates from the query (if provided)
        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate) : new Date();

        // Find workouts within the date range and activity type
        const workouts = await Workout.find({
            user: req.user._id,  // Filter by authenticated user
            date: { $gte: start, $lte: end },
            ...(activityType && { 'exercises.type': activityType })  // Optional activity type filter
        });

        // Calculate total workouts, exercises, and time spent per activity type
        const stats = workouts.reduce((acc, workout) => {
            workout.exercises.forEach(exercise => {
                if (!acc[exercise.type]) {
                    acc[exercise.type] = { count: 0, totalSets: 0, totalReps: 0, totalWeight: 0 };
                }

                acc[exercise.type].count += 1;
                acc[exercise.type].totalSets += exercise.sets;
                acc[exercise.type].totalReps += exercise.reps;
                acc[exercise.type].totalWeight += exercise.weight || 0;
            });
            return acc;
        }, {});

        // Find goals and determine if they were completed within the date range
        const goals = await Goal.find({
            user: req.user._id,
            targetDate: { $gte: start, $lte: end },
        });

        const completedGoals = goals.filter(goal => goal.isCompleted).length;
        const incompleteGoals = goals.filter(goal => !goal.isCompleted).length;

        res.json({
            totalWorkouts: workouts.length,
            statsByActivity: stats,
            goalSummary: {
                totalGoals: goals.length,
                completedGoals,
                incompleteGoals,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    createWorkout,
    getWorkouts,
    updateWorkout,
    deleteWorkout,
    getWorkoutStats,
};

