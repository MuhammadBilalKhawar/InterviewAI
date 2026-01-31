// backend/src/controllers/questionController.js
const Question = require("../models/question");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

exports.generateQuestionsAI = async (req, res) => {
  try {
    // Validate cron secret header
    const cronSecret = req.headers["x-cron-secret"];
    if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
      console.log("❌ Unauthorized cron request. Secret mismatch.");
      return res.status(401).json({ message: "Unauthorized - Invalid cron secret" });
    }

    console.log("🤖 [CRON] Starting AI question generation...");

    const prompt = `Generate exactly 10 unique technical interview questions for software engineers.
Return ONLY a valid JSON array with NO markdown, code blocks, or extra text.

Each question must be in this exact format:
{
  "text": "The interview question here",
  "category": "Category like React, Node.js, Data Structures, System Design, Algorithms, Databases, etc.",
  "difficulty": "Easy" or "Medium" or "Hard"
}

Requirements:
- Make questions diverse (frontend, backend, databases, algorithms, system design)
- Questions should be appropriate for technical interviews
- Difficulty should be realistic and varied
- Return ONLY the JSON array, nothing else

Example output format:
[
  {"text": "What is...", "category": "React", "difficulty": "Easy"},
  {"text": "Explain...", "category": "System Design", "difficulty": "Hard"}
]`;

    console.log("📤 Sending prompt to Gemini AI...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text.trim();
    console.log("📥 AI Response received, parsing...");

    // Remove markdown code blocks if present
    text = text.replace(/```json\n?|```\n?/g, "").trim();

    let questions;
    try {
      questions = JSON.parse(text);
    } catch (parseErr) {
      console.error("❌ JSON Parse Error:", parseErr.message);
      console.error("📝 Raw response:", text.substring(0, 200));
      throw new Error("Invalid JSON from AI: " + parseErr.message);
    }

    if (!Array.isArray(questions)) {
      throw new Error("AI response is not an array");
    }

    if (questions.length === 0) {
      throw new Error("AI returned empty array");
    }

    console.log(`✅ Parsed ${questions.length} questions from AI`);

    // Validate and add metadata to each question
    const questionsWithMetadata = questions.map((q, index) => {
      if (!q.text || !q.category || !q.difficulty) {
        console.warn(`⚠️ Question ${index + 1} missing fields, skipping...`);
        return null;
      }

      // Validate difficulty
      const validDifficulty = ["Easy", "Medium", "Hard"].includes(q.difficulty)
        ? q.difficulty
        : "Medium";

      return {
        text: q.text,
        category: q.category || "General",
        difficulty: validDifficulty,
        author: null, // AI-generated, no specific author
        generatedByAI: true,
        generatedAt: new Date(),
      };
    }).filter(q => q !== null);

    if (questionsWithMetadata.length === 0) {
      throw new Error("No valid questions after validation");
    }

    console.log(`🔄 Inserting ${questionsWithMetadata.length} questions into database...`);
    const created = await Question.insertMany(questionsWithMetadata);

    console.log(`✅ Successfully created ${created.length} AI-generated questions`);

    res.json({
      success: true,
      message: `Successfully generated and stored ${created.length} questions`,
      count: created.length,
      questions: created,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("❌ [CRON] Error generating questions:", err.message);
    res.status(500).json({
      success: false,
      message: "Error generating questions: " + err.message,
      error: err.message,
    });
  }
};

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
