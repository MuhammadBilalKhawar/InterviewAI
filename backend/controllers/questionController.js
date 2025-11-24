// backend/src/controllers/questionController.js
const Question = require("../models/question");


exports.create = async (req, res) => {
  const { text, category, difficulty } = req.body;
  try {
    const q = await Question.create({
      text,
      category,
      difficulty,
      author: req.user._id,
    });
    res.json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  const qs = await Question.find().sort({ createdAt: -1 });
  res.json(qs);
};

exports.random = async (req, res) => {
  const count = await Question.countDocuments();
  const rand = Math.floor(Math.random() * count);
  const q = await Question.findOne().skip(rand);
  res.json(q);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { text, category, difficulty } = req.body;
  try {
    const q = await Question.findByIdAndUpdate(
      id,
      { text, category, difficulty },
      { new: true }
    );
    if (!q) return res.status(404).json({ message: "Question not found" });
    res.json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const q = await Question.findByIdAndDelete(id);
    if (!q) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
