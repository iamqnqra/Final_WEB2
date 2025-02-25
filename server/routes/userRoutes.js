const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt'); // если используется для хеширования пароля
const jwt = require('jsonwebtoken'); // добавляем для проверки токена
require('dotenv').config();

const User = require('../models/user');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// Получить профиль пользователя
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Обновить профиль пользователя
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/edit-profile', (req, res) => {
    if (!req.session || !req.session.user) {
      return res.redirect('/edit-info.html');
    }
    res.sendFile(path.join(__dirname, '../view', 'edit-info.html'));
});


router.post('/edit-profile', async (req, res) => {
    const { token, username, age, gender, password } = req.body;

    let userId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Если сессия есть, берём идентификатор пользователя из неё
    if (req.session && req.session.user) {
        userId = req.session.user._id;
    } else if (req.body.token) {
        // Если сессии нет, пытаемся декодировать переданный токен
        try {
            const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            console.error('Token verification error:', err);
            return res.redirect('/login.html');
        }
    } else {
        return res.redirect('/login.html');
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.redirect('/profile.html');
        }

        const parsedAge = parseInt(age, 10);
        if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
            return res.redirect('/api/users/edit-profile?error=Age+must+be+between+1+and+120');
        }

        // Проверяем, существует ли другой пользователь с таким же username
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                return res.status(400).json({ error: 'Username already taken' });
            }
            user.username = username;
        }

        user.age = parsedAge;
        user.gender = gender || user.gender;
        if (password && password.trim() !== '') {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        // Если сессия существует, обновляем её данные
        if (req.session) {
            req.session.user = user;
        }

        res.redirect('/profile.html');
    } catch (error) {
        console.error('Error in edit-profile POST:', error);
        res.status(500).send('Server error');
    }
});


module.exports = router;
