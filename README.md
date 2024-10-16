# Fitness Tracker Application Backend

The **Fitness Tracker Application** backend is built with **Node.js**, **Express**, and **MongoDB**. It manages user data, workout logs, goal tracking, and provides endpoints for data visualization such as calories burned over time and types of workouts.

## Features

- **User Authentication**: Register and login with JWT-based authentication.
- **Workout Logs**: Log, update, and delete workout activities.
- **Goal Tracking**: Set, update, and track weekly/monthly fitness goals.
- **Statistics & Data Visualization**:
  - **Calories Burned Over Time**: View total calories burned with breakdowns (daily, weekly, monthly).
  - **Types of Workouts**: Analyze the distribution of different workout types.
  - **Goal Achievement**: Track progress towards fitness goals.

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: Bcrypt.js
- **Data Visualization**: Aggregation pipelines for generating statistics
- **Deployment**: Heroku, MongoDB Atlas

API Endpoints
Authentication & Users
POST /api/users/register - Register a new user
POST /api/users/login - Login a user and receive a JWT
Workouts
POST /api/workouts - Log a new workout (Private)
GET /api/workouts - Get all workouts for the logged-in user (Private)
PUT /api/workouts/:id - Update a specific workout log (Private)
DELETE /api/workouts/:id - Delete a specific workout log (Private)
Goals
POST /api/goals - Set a new weekly/monthly goal (Private)
GET /api/goals - Get all goals for the logged-in user (Private)
PUT /api/goals/:goalId - Update a specific goal (Private)
PUT /api/goals/:goalId/progress - Update progress of a goal (Private)
DELETE /api/goals/:goalId - Delete a specific goal (Private)
Statistics
GET /api/stats/calories - Get calories burned over time
