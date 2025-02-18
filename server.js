require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes.js');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
