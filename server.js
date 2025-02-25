require('dotenv').config();
const path = require('path');
const express = require('express');
const connectDB = require('./server/config/db');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const fs = require('fs');
const { errorHandler } = require('./server/middleware/errorHandler');   
const User = require('./server/models/user'); // Убедитесь, что путь правильный

const authRoutes = require('./server/routes/authRoutes');
const userRoutes = require('./server/routes/userRoutes');
const taskRoutes = require('./server/routes/taskRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Настройка сессий и flash-сообщений
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(flash());


// Раздача статических файлов
app.use(express.static(path.join(__dirname, 'view')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/edit-profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'edit-info.html'));
});

// Раздача загруженных изображений
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Убедимся, что папка `uploads` существует
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Конфигурация загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// Загрузка аватара
const jwt = require('jsonwebtoken');

app.post('/api/users/upload-avatar', upload.single('avatar'), async (req, res) => {

    let userId;
    if (req.session && req.session.user) {
        userId = req.session.user._id;  // Если пользователь есть в сессии
    } else if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1]; // "Bearer token"
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id; // Декодируем user ID из JWT
        } catch (err) {
            console.error('JWT verification failed:', err);
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        console.log('No session or token provided');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found in database');
            return res.status(404).json({ error: 'User not found' });
        }

        user.avatar = '/uploads/' + req.file.filename;
        await user.save();

        res.json({ message: 'Avatar updated', avatar: user.avatar });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ error: 'Error uploading avatar' });
    }
});

// Подключение маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
