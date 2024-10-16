const Workout = require('../model/workout.model');
const Goal = require('../model/goal.model');

// @desc    Get calories burned over time
// @route   GET /api/stats/calories
// @access  Private
const getCaloriesBurnedOverTime = async (req, res) => {
    try {
        const { startDate, endDate, interval } = req.query;  // interval: daily, weekly, monthly

        // Validate interval
        const validIntervals = ['daily', 'weekly', 'monthly'];
        const chosenInterval = interval && validIntervals.includes(interval.toLowerCase()) ? interval.toLowerCase() : 'daily';

        // Parse dates
        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate) : new Date();

        // Aggregation pipeline
        const pipeline = [
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: start, $lte: end },
                },
            },
            { $unwind: '$exercises' },
            {
                $group: {
                    _id: null,
                    totalCalories: { $sum: '$exercises.calories' },
                },
            },
        ];

        const totalCaloriesResult = await Workout.aggregate(pipeline);
        const totalCalories = totalCaloriesResult[0] ? totalCaloriesResult[0].totalCalories : 0;

        // Aggregation for calories over time
        let dateFormat;
        switch (chosenInterval) {
            case 'weekly':
                dateFormat = { $isoWeek: "$date" };
                break;
            case 'monthly':
                dateFormat = { $month: "$date" };
                break;
            case 'daily':
            default:
                dateFormat = { $dayOfMonth: "$date" };
        }

        const caloriesOverTimePipeline = [
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: start, $lte: end },
                },
            },
            { $unwind: '$exercises' },
            {
                $group: {
                    _id: chosenInterval === 'monthly' ? { month: { $month: "$date" }, year: { $year: "$date" } } :
                        chosenInterval === 'weekly' ? { week: { $isoWeek: "$date" }, year: { $year: "$date" } } :
                            { day: { $dayOfMonth: "$date" }, month: { $month: "$date" }, year: { $year: "$date" } },
                    calories: { $sum: '$exercises.calories' },
                },
            },
            {
                $sort: { '_id.year': 1, ...(chosenInterval === 'monthly' ? { '_id.month': 1 } : chosenInterval === 'weekly' ? { '_id.week': 1 } : { '_id.day': 1 }) },
            },
        ];

        const caloriesOverTime = await Workout.aggregate(caloriesOverTimePipeline);

        res.json({
            totalCalories,
            caloriesOverTime,
        });
    } catch (error) {
        console.error('Error fetching calories burned over time:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get types of workouts
// @route   GET /api/stats/workout-types
// @access  Private
const getWorkoutTypes = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Parse dates
        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate) : new Date();

        // Aggregation pipeline
        const pipeline = [
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: start, $lte: end },
                },
            },
            { $unwind: '$exercises' },
            {
                $group: {
                    _id: '$exercises.type',
                    count: { $sum: 1 },
                    totalCalories: { $sum: '$exercises.calories' },
                },
            },
            {
                $sort: { count: -1 },
            },
        ];

        const workoutTypes = await Workout.aggregate(pipeline);

        res.json(workoutTypes);
    } catch (error) {
        console.error('Error fetching workout types:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get goal achievement status
// @route   GET /api/stats/goals
// @access  Private
const getGoalAchievement = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Parse dates
        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate) : new Date();

        // Find goals within date range
        const goals = await Goal.find({
            user: req.user._id,
            targetDate: { $gte: start, $lte: end },
        });

        // Calculate goal achievement
        const goalStats = await Promise.all(goals.map(async (goal) => {
            let progress = 0;
            switch (goal.type) {
                case 'workouts':
                    const workoutCount = await Workout.countDocuments({
                        user: req.user._id,
                        date: { $gte: start, $lte: end },
                    });
                    progress = workoutCount;
                    break;
                case 'calories':
                    const totalCalories = await Workout.aggregate([
                        { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
                        { $unwind: '$exercises' },
                        { $group: { _id: null, total: { $sum: '$exercises.calories' } } },
                    ]);
                    progress = totalCalories[0] ? totalCalories[0].total : 0;
                    break;
                case 'hours':
                    const totalMinutes = await Workout.aggregate([
                        { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
                        {
                            $group: {
                                _id: null,
                                totalMinutes: { $sum: '$duration' },  // Sum of workout durations
                            },
                        },
                    ]);
                    progress = totalMinutes[0] ? totalMinutes[0].totalMinutes / 60 : 0;  // Convert to hours
                    break;
                default:
                    progress = 0;
            }

            return {
                goalId: goal._id,
                type: goal.type,
                targetValue: goal.targetValue,
                timeFrame: goal.timeFrame,
                targetDate: goal.targetDate,
                currentProgress: progress,
                isCompleted: progress >= goal.targetValue,
            };
        }));

        res.json(goalStats);
    } catch (error) {
        console.error('Error fetching goal achievement status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCaloriesBurnedOverTime,
    getWorkoutTypes,
    getGoalAchievement,
};
