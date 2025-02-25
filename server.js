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
const User = require('./server/models/user'); 

const authRoutes = require('./server/routes/authRoutes');
const userRoutes = require('./server/routes/userRoutes');
const taskRoutes = require('./server/routes/taskRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(flash());


app.use(express.static(path.join(__dirname, 'view')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/edit-profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'edit-info.html'));
});

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

const jwt = require('jsonwebtoken');

app.post('/api/users/upload-avatar', upload.single('avatar'), async (req, res) => {

    let userId;
    if (req.session && req.session.user) {
        userId = req.session.user._id; 
    } else if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1]; 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id; 
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

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
