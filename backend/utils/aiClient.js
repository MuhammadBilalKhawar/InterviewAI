const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});
const openaiSend = async (prompt, opts = {}) => {
  let promptString =
    "Grade the following interview answer on:\n- Clarity (score 1–10)\n- Relevance (1–10)\n- Technical depth (1–10)\n- Structure (1–10)\nAlso provide:\n- Improved version\n- Mistakes list\nAnswer in JSON.\n";
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log(response.text);
  return response.text;
};
module.exports = openaiSend;
