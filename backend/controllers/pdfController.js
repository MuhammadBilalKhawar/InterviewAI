// controllers/pdfController.js
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const Question = require("../models/question");

exports.uploadQuestionsFromPDF = async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded",
      });
    }

    console.log("REQ FILE => ", req.file);
    console.log("📄 PDF Upload - File received:", {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    // Load PDF
    const loadingTask = pdfjsLib.getDocument({ data: req.file.buffer });
    const pdf = await loadingTask.promise;

    console.log(`📄 Total Pages in PDF: ${pdf.numPages}`);

    let fullText = "";

    // Extract text page by page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += "\n" + pageText;
    }

    console.log("📝 Extracted text length:", fullText.length);

    if (!fullText.trim()) {
      return res.status(400).json({
        success: false,
        message: "PDF appears empty",
      });
    }

    // Split into question blocks
    const blocks = fullText
      .split(/\n\s*\n|(?=\d+\.)/) // split by blank line OR numbered questions
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    console.log("📦 Total blocks found:", blocks.length);

    const created = [];
    const skipped = [];

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];

      // Take first line of block
      let line = block.split(/\r?\n/)[0].trim();

      // Remove leading numbers like "1." or "1)"
      line = line.replace(/^\d+[\.)]\s*/, "").trim();

      // Split: Question | Category | Difficulty
      const parts = line.split("|").map((p) => p.trim());
      const questionText = parts[0];
      const category = parts[1] || "General";
      const difficulty = parts[2] || "Medium";

      // Validate question text
      if (!questionText || questionText.length < 10) {
        skipped.push({
          index: i + 1,
          text: questionText || line,
          reason: "Too short",
        });
        continue;
      }

      // Validate difficulty
      const validDifficulty =
        ["Easy", "Medium", "Hard"].find(
          (d) => d.toLowerCase() === difficulty.toLowerCase()
        ) || "Medium";

      created.push({
        text: questionText,
        category,
        difficulty: validDifficulty,
      });
    }

    console.log("✅ Valid questions:", created.length);
    console.log("⚠️ Skipped:", skipped.length);

    if (!created.length) {
      return res.status(400).json({
        success: false,
        message: "No valid questions found.",
        skipped,
        hint: "Format must be: Question | Category | Difficulty",
      });
    }

    const inserted = await Question.insertMany(created);

    return res.status(201).json({
      success: true,
      message: "Questions uploaded successfully",
      added: inserted.length,
      skipped: skipped.length,
      questions: inserted,
      skippedDetails: skipped.length ? skipped : undefined,
    });
  } catch (err) {
    console.error("❌ PDF Upload Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to process PDF",
      error: err.message,
    });
  }
};
