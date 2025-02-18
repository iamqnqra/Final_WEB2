const Task = require('../models/task');

exports.createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;
  const task = new Task({ userId: req.user.id, title, description, dueDate });
  
  await task.save();
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
};
