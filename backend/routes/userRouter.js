const express = require("express");
const router = express.Router();
const { list } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/list", protect, adminOnly, list);

module.exports = router;
