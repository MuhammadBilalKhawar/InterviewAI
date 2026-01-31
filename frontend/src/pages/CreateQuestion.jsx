import React, { useState } from "react";
import NavBar from "../components/NavBar";

const API_BASE = "https://interviewai-zmzj.onrender.com/api";

export default function CreateQuestion() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || !category.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch(`${API_BASE}/questions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          category,
          difficulty,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create question");
      }

      const data = await res.json();
      setSuccess("Question created successfully!");
      setText("");
      setCategory("");
      setDifficulty("Medium");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-900 via-black to-slate-950 text-white">
      <NavBar mode="admin" active="create-question" />

      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-2 animate-fade-in">Create New Question</h1>
        <p className="text-sm sm:text-base text-slate-400 mb-8 animate-slide-in-down" style={{ animationDelay: '0.1s' }}>
          Add a new interview question to the database
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-700/30 border border-red-600 rounded text-red-300 animate-shake">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-amber-500/15 border border-amber-500/30 rounded text-amber-200 animate-slide-in-down">
            {success}
          </div>
        )}

        {/* PDF Upload for Bulk Questions */}
        <form
          className="mb-8 flex items-center gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const fileInput = e.target.elements.pdf;
            if (!fileInput.files.length) return alert("Select a PDF file");
            const formData = new FormData();
            formData.append("pdf", fileInput.files[0]);
            const res = await fetch("https://interviewai-zmzj.onrender.com/api/pdf/upload", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            });
            const result = await res.json();
            if (res.ok) {
              alert(`Added ${result.added} questions from PDF.`);
            } else {
              alert(result.message || "Failed to upload PDF");
            }
          }}
        >
          <input
            type="file"
            name="pdf"
            accept="application/pdf"
            className="bg-slate-950/60 text-white px-2 py-1 rounded border border-amber-500/30"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded font-semibold"
          >
            Upload PDF Questions
          </button>
        </form>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/50 rounded-2xl p-8 ring-1 ring-amber-500/20 space-y-6"
        >
          {/* Question Text */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Question Text *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the interview question..."
              className="w-full min-h-[150px] resize-none bg-slate-950/50 border border-amber-500/30 rounded-md p-4 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Category *
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Data Structures, Algorithms, System Design"
              className="w-full bg-slate-950/50 border border-amber-500/30 rounded-md p-3 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
              required
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-950/50 border border-amber-500/30 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 px-6 py-3 rounded-md text-black font-semibold transition"
            >
              {loading ? "Creating..." : "Create Question"}
            </button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setCategory("");
                setDifficulty("Medium");
                setError("");
              }}
              className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 px-6 py-3 rounded-md text-amber-200 font-semibold transition border border-amber-500/30"
            >
              Clear Form
            </button>
          </div>
        </form>

        <div className="mt-8 p-6 bg-slate-900/40 rounded-xl border border-amber-500/20">
          <h3 className="text-lg font-semibold mb-3">
            Tips for creating good questions:
          </h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>✓ Make questions specific and answerable</li>
            <li>✓ Ensure appropriate difficulty level</li>
            <li>✓ Categorize correctly for better organization</li>
            <li>✓ Avoid ambiguous or overly broad questions</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
