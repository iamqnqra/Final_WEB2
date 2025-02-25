const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, default: null },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    avatar: { type: String, default: '/uploads/default-avatar.png' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
