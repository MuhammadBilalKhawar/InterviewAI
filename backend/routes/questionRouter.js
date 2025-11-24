const express = require("express");
const router = express.Router();
const {
  create,
  list,
  random,
  update,
  delete: deleteQuestion,
} = require("../controllers/questionController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/list", protect, list);
router.get("/random", protect, random);
router.post("/create", protect, adminOnly, create);
router.put("/:id", protect, adminOnly, update);
router.delete("/:id", protect, adminOnly, deleteQuestion);

module.exports = router;
