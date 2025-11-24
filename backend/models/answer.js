const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    clarity: Number,
    relevance: Number,
    depth: Number,
    structure: Number,
    overall: Number,
  },
  { _id: false }
);

const answerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    answerText: String,
    score: scoreSchema,
    aiFeedback: { type: String },
    aiRaw: { type: mongoose.Schema.Types.Mixed }, // store raw AI JSON for audit
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answer", answerSchema);
