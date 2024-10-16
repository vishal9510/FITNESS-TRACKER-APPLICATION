const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');



// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());






// Import Routes
const router = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const goalRoutes = require('./routes/goalRoutes');
const statsRoutes = require('./routes/statsRoutes');




// Use Routes
app.use('/api/users', router);
app.use('/api/workouts', workoutRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/stats', statsRoutes); 






// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

