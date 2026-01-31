const express = require("express");
const multer = require("multer");
const router = express.Router();
const { list, getProfile, updateProfile, extractSkillsFromCV } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Configure multer for file uploads (memory storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase();
    
    // Accept based on file extension for better compatibility
    if (fileName.endsWith('.pdf') || 
        fileName.endsWith('.doc') || 
        fileName.endsWith('.docx') ||
        fileName.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

router.get("/list", protect, adminOnly, list);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile/upload-cv", protect, upload.single('cv'), extractSkillsFromCV);

module.exports = router;
