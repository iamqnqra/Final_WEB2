const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    importance: { type: String, enum: ['low', 'medium', 'high'], required: true },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
