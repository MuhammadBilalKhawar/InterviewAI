// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRouter");
const questionRoutes = require("./routes/questionRouter");
const answerRoutes = require("./routes/answerRouter");
const userRoutes = require("./routes/userRouter");
const pdfRoutes = require("./routes/pdfRouter");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // or your frontend port
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use("/api/pdf", pdfRoutes);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
// JSON parse error handler (body-parser / express.json)
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({
      message:
        "Invalid JSON payload. Ensure request body is valid JSON (use double quotes) and set Content-Type: application/json",
    });
  }
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message:
        "Invalid JSON payload. Ensure request body is valid JSON (use double quotes) and set Content-Type: application/json",
    });
  }
  next(err);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
