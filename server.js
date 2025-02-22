require('dotenv').config();
const express = require('express');
const connectDB = require('./server/config/db');
const cors = require('cors');

const authRoutes = require('./server/routes/authRoutes');
const userRoutes = require('./server/routes/userRoutes');
const taskRoutes = require('./server/routes/taskRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

connectDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
