const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadQuestionsFromPDF } = require("../controllers/pdfController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("pdf"),
  uploadQuestionsFromPDF
);

module.exports = router;
