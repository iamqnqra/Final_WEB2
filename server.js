require('dotenv').config();
const path = require('path');

const express = require('express');
const connectDB = require('./server/config/db');
const cors = require('cors');

const authRoutes = require('./server/routes/authRoutes');
const userRoutes = require('./server/routes/userRoutes');
const taskRoutes = require('./server/routes/taskRoutes');

const app = express();

app.use(express.json());
app.use(cors());


// Раздаем статические файлы (CSS, JS, изображения)
app.use(express.static(path.join(__dirname, 'public')));

// Отдаем index.html при переходе на корень
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

connectDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
