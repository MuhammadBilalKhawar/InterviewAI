import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

const API_BASE = "https://interviewai-zmzj.onrender.com/api";

export default function ListQuestions() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      setFilteredQuestions(
        questions.filter((q) =>
          q.text.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredQuestions(questions);
    }
  }, [search, questions]);

  async function fetchQuestions() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/questions/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id) {
    try {
      const res = await fetch(`${API_BASE}/questions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Failed to update question");
      const updated = await res.json();
      setQuestions(questions.map((q) => (q._id === id ? updated : q)));
      setEditingId(null);
      setEditData({});
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/questions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete question");
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const startEdit = (question) => {
    setEditingId(question._id);
    setEditData({
      text: question.text,
      category: question.category,
      difficulty: question.difficulty,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-amber-900 via-black to-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-amber-500 animate-rotate-slow"></div>
          <p className="text-lg text-slate-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-900 via-black to-slate-950 text-white">
      <NavBar mode="admin" active="list-questions" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-2 animate-fade-in">Manage Questions</h1>
        <p className="text-slate-400 mb-8 animate-slide-in-down" style={{ animationDelay: '0.1s' }}>
          View, edit, and delete interview questions
        </p>

        <div className="mb-6 flex items-center gap-4 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full max-w-md px-4 py-2 rounded-md bg-slate-950/50 border border-amber-500/30 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-700/30 border border-red-600 rounded text-red-300 animate-shake">
            {error}
          </div>
        )}

        {filteredQuestions.length === 0 ? (
          <div className="bg-slate-900/50 rounded-2xl p-8 text-center text-slate-400 ring-1 ring-amber-500/20 animate-scale-in hover:ring-amber-500/40 transition-all duration-300">
            <p>No questions found. Create one to get started!</p>
            <a
              href="/create-question"
              className="mt-4 inline-block bg-amber-500 hover:bg-amber-400 hover:scale-105 px-6 py-2 rounded-md text-black font-semibold transition-all duration-300 active:scale-95"
            >
              Create Question
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question, idx) => (
              <div
                key={question._id}
                className="bg-slate-900/50 rounded-2xl p-6 ring-1 ring-amber-500/20 animate-slide-in-up hover:ring-amber-500/40 hover:bg-slate-900/70 transition-all duration-300" style={{ animationDelay: `${idx * 50}ms` }}
              >
                {editingId === question._id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-200 mb-2">
                        Question Text
                      </label>
                      <textarea
                        value={editData.text}
                        onChange={(e) =>
                          setEditData({ ...editData, text: e.target.value })
                        }
                        className="w-full min-h-[100px] resize-none bg-slate-950/50 border border-amber-500/30 rounded-md p-3 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Category
                        </label>
                        <input
                          type="text"
                          value={editData.category}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              category: e.target.value,
                            })
                          }
                          className="w-full bg-slate-950/50 border border-amber-500/30 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Difficulty
                        </label>
                        <select
                          value={editData.difficulty}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              difficulty: e.target.value,
                            })
                          }
                          className="w-full bg-slate-950/50 border border-amber-500/30 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleUpdate(question._id)}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 px-4 py-2 rounded-md text-black font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditData({});
                        }}
                        className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 px-4 py-2 rounded-md text-amber-200 font-semibold border border-amber-500/30"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <p className="text-slate-200 text-lg mb-2">
                        {question.text}
                      </p>
                      <div className="flex gap-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/20">
                          {question.category}
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-100 border border-amber-500/20">
                          {question.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startEdit(question)}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 px-4 py-2 rounded-md text-black font-semibold text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(question._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
