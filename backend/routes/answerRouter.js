const express = require("express");
const router = express.Router();
const {
  gradeAnswer,
  getHistory,
  listAll,
} = require("../controllers/answerController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/grade", protect, gradeAnswer);
router.get("/history", protect, getHistory);
router.get("/all", protect, adminOnly, listAll);

module.exports = router;
