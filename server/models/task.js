const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  importance: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);