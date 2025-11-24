// List all answers (admin only)
exports.listAll = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const answers = await Answer.find()
    .populate("question user")
    .sort({ createdAt: -1 });
  res.json(answers);
};
// backend/src/controllers/answerController.js
const Answer = require("../models/answer");
const Question = require("../models/question");
const aiClient = require("../utils/aiClient");

const gradingPrompt = (questionText, answerText) => `
You are an expert interviewer and grader.
Grade the following interview answer for this question.

Question:
${questionText}

Answer:
${answerText}

Return a JSON object exactly in this format:
{
  "clarity": <integer 1-10>,
  "relevance": <integer 1-10>,
  "depth": <integer 1-10>,
  "structure": <integer 1-10>,
  "overall": <decimal 1-10>,
  "improved_answer": "<a concise improved version>",
  "feedback": ["one line bullet 1", "one line bullet 2"]
}

Be concise and respond only with valid JSON.
`;

exports.gradeAnswer = async (req, res) => {
  try {
    const { questionId, answerText } = req.body;
    const question = await Question.findById(questionId);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    const prompt = gradingPrompt(question.text, answerText);

    // Send to AI client
    const aiResponse = await aiClient(prompt, { max_tokens: 500 });
    // aiResponse should be text containing JSON — try parse
    let parsed;
    try {
      // Sometimes AI returns codeblock. Extract JSON
      const text = aiResponse.trim().replace(/```json|```/g, "");
      parsed = JSON.parse(text);
    } catch (err) {
      // fallback: try to find first JSON substring
      const text = aiResponse;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI did not return JSON");
      parsed = JSON.parse(jsonMatch[0]);
    }

    const answerDoc = await Answer.create({
      user: req.user._id,
      question: question._id,
      answerText,
      score: {
        clarity: parsed.clarity,
        relevance: parsed.relevance,
        depth: parsed.depth,
        structure: parsed.structure,
        overall: parsed.overall,
      },
      aiFeedback: parsed.feedback.join(" | "),
      aiRaw: parsed,
    });

    res.json({ answer: answerDoc, parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getHistory = async (req, res) => {
  const answers = await Answer.find({ user: req.user._id })
    .populate("question")
    .sort({ createdAt: -1 });
  res.json(answers);
};
