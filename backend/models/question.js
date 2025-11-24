const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    category: { type: String, default: "Technical" },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
