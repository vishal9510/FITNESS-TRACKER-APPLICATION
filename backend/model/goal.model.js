const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,  // Each goal is linked to a user
    },
    type: {
        type: String,
        required: true,
        enum: ['workouts', 'calories', 'hours'],  // Type of goal (workouts, calories, hours)
    },
    targetValue: {
        type: Number,
        required: true,  // The target value (e.g., 5 workouts or 2000 calories)
    },
    timeFrame: {
        type: String,
        required: true,
        enum: ['weekly', 'monthly'],  // Time frame of the goal (weekly or monthly)
    },
    currentProgress: {
        type: Number,
        default: 0,  // Track the current progress towards the goal
    },
    targetDate: {
        type: Date,
        required: true,  // The target date (e.g., end of the week/month)
    },
    isCompleted: {
        type: Boolean,
        default: false,  // Whether the goal is completed
    },
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
