const express = require('express');
const User = require('../models/user'); // assuming you have a User model
const authenticateToken = require('../middleware/authMiddleware'); // middleware to check if the user is authenticated

const router = express.Router();

// Route to get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { username, email } = req.body; // You can add more fields if needed
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user profile
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
