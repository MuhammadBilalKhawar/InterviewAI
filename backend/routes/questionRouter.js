const express = require("express");
const router = express.Router();
const {
  create,
  list,
  random,
  update,
  delete: deleteQuestion,
  generateQuestionsAI,
  recommended,
} = require("../controllers/questionController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public endpoint for cron job (protected by secret header)
router.post("/generate-ai-questions", generateQuestionsAI);

router.get("/list", protect, list);
router.get("/random", protect, random);
router.get("/recommended", protect, recommended);
router.post("/create", protect, adminOnly, create);
router.put("/:id", protect, adminOnly, update);
router.delete("/:id", protect, adminOnly, deleteQuestion);

module.exports = router;
