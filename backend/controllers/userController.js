// List all users (admin only)
exports.list = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
};
// backend/src/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  console.log(
    "[auth.register]",
    req.method,
    req.path,
    "content-type:",
    req.headers["content-type"]
  );
  console.log("[auth.register] req.body:", req.body);
  if (!req.body) {
    return res.status(400).json({
      message:
        "Missing request body. Make sure you send JSON with Content-Type: application/json",
    });
  }
  const { name, email, password } = req.body || {};
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email in use" });
    user = await User.create({ name, email, password });
    res.json({
      token: signToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    res.json({
      token: signToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
