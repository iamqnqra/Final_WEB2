const express = require('express');
const Task = require('../models/task');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { title, description } = req.body;
    const newTask = new Task({ user: req.user.id, title, description });
    await newTask.save();
    res.json(newTask);
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        if (task.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.completed = req.body.completed ?? task.completed;

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await task.deleteOne(); // This is the new Mongoose method to delete a document
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
