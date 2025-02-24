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

<<<<<<< HEAD

// Раздаем статические файлы (CSS, JS, изображения)
app.use(express.static(path.join(__dirname, 'public')));

// Отдаем index.html при переходе на корень
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});


=======
>>>>>>> 0a64b68af60a68ea6e1c84aa5f0c449b0b7ebbfd
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

connectDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
