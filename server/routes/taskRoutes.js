const express = require('express');
const Task = require('../models/task');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Получить все задачи пользователя
router.get('/', authenticateToken, async (req, res) => {
    const { importance, sortBy } = req.query;
    let filter = { user: req.user.id };
    if (importance) {
      filter.importance = importance;
    }
    let sortOption = {};
    if (sortBy === "dueDate") {
      sortOption.dueDate = 1;
    } else if (sortBy === "createdAt") {
      sortOption.createdAt = -1;
    }
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Получить одну задачу по ID (необходим для редактирования)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        if (task.user.toString() !== req.user.id)
            return res.status(403).json({ error: 'Unauthorized' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// Создать новую задачу
router.post('/', authenticateToken, async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTask = new Task({ user: req.user.id, title, description });
        await newTask.save();
        res.json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Обновить задачу
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        if (task.user.toString() !== req.user.id)
            return res.status(403).json({ error: 'Unauthorized' });

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.completed = req.body.completed ?? task.completed;

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Удалить задачу
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
