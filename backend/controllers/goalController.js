const Goal = require('../model/goal.model');

// @desc    Set a new weekly or monthly goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res) => {
    const { type, targetValue, timeFrame, targetDate } = req.body;

    if (!type || !targetValue || !timeFrame || !targetDate) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const goal = new Goal({
        user: req.user._id,  // The goal is linked to the authenticated user
        type,
        targetValue,
        timeFrame,
        targetDate,
    });

    const createdGoal = await goal.save();
    res.status(201).json(createdGoal);
};


// @desc    Update progress of a goal
// @route   PUT /api/goals/:goalId/progress
// @access  Private
const updateGoalProgress = async (req, res) => {
    const goal = await Goal.findById(req.params.goalId);

    if (goal && goal.user.toString() === req.user._id.toString()) {
        goal.currentProgress += req.body.incrementValue || 0;  // Increment the progress by the provided value

        if (goal.currentProgress >= goal.targetValue) {
            goal.isCompleted = true;  // Mark as completed if target is reached
        }

        const updatedGoal = await goal.save();
        res.json(updatedGoal);
    } else {
        res.status(404).json({ message: 'Goal not found or not authorized' });
    }
};



// @desc    Get all goals of a user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
    const goals = await Goal.find({ user: req.user._id });
    res.json(goals);
};


// @desc    Update an existing goal
// @route   PUT /api/goals/:goalId
// @access  Private
const updateGoal = async (req, res) => {
    const goal = await Goal.findById(req.params.goalId);

    if (goal && goal.user.toString() === req.user._id.toString()) {
        goal.title = req.body.title || goal.title;
        goal.description = req.body.description || goal.description;
        goal.targetDate = req.body.targetDate || goal.targetDate;
        goal.isCompleted = req.body.isCompleted || goal.isCompleted;

        const updatedGoal = await goal.save();
        res.json(updatedGoal);
    } else {
        res.status(404).json({ message: 'Goal not found or not authorized' });
    }
};


// @desc    Delete a goal
// @route   DELETE /api/goals/:goalId
// @access  Private
const deleteGoal = async (req, res) => {
    const goal = await Goal.findById(req.params.goalId);

    if (goal && goal.user.toString() === req.user._id.toString()) {
        await goal.remove();
        res.json({ message: 'Goal removed' });
    } else {
        res.status(404).json({ message: 'Goal not found or not authorized' });
    }
};

module.exports = {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
};
