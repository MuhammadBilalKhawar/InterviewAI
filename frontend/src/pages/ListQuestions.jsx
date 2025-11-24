import React, { useState, useEffect } from "react";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

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
      <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-900 to-slate-800 text-white flex items-center justify-center">
        <p className="text-lg text-slate-300">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
      <header className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-sky-400">InterviewAI</div>
        <nav className="flex items-center gap-6">
          <a href="/dashboard" className="text-slate-300">
            Dashboard
          </a>
          <a href="/create-question" className="text-slate-300">
            Create Question
          </a>
          <a href="/list-questions" className="text-sky-300 font-medium">
            List Questions
          </a>
          <button
            onClick={handleLogout}
            className="text-slate-300 hover:text-red-400 text-sm"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-2">Manage Questions</h1>
        <p className="text-slate-300 mb-8">
          View, edit, and delete interview questions
        </p>

        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full max-w-md px-4 py-2 rounded-md bg-slate-900/30 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-700/30 border border-red-600 rounded text-red-300">
            {error}
          </div>
        )}

        {filteredQuestions.length === 0 ? (
          <div className="bg-slate-800/40 rounded-2xl p-8 text-center text-slate-400">
            <p>No questions found. Create one to get started!</p>
            <a
              href="/create-question"
              className="mt-4 inline-block bg-sky-600 hover:bg-sky-700 px-6 py-2 rounded-md text-white"
            >
              Create Question
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question._id}
                className="bg-slate-800/40 rounded-2xl p-6 ring-1 ring-slate-700"
              >
                {editingId === question._id ? (
                  // Edit Mode
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
                        className="w-full min-h-[100px] resize-none bg-slate-900/30 border border-slate-700 rounded-md p-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white"
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
                          className="w-full bg-slate-900/30 border border-slate-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white"
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
                          className="w-full bg-slate-900/30 border border-slate-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white"
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
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md text-white font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditData({});
                        }}
                        className="flex-1 bg-slate-700/60 hover:bg-slate-700/80 px-4 py-2 rounded-md text-white font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="mb-4">
                      <p className="text-slate-200 text-lg mb-2">
                        {question.text}
                      </p>
                      <div className="flex gap-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-sky-500/30 text-sky-300">
                          {question.category}
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/30 text-purple-300">
                          {question.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startEdit(question)}
                        className="flex-1 bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-md text-white font-semibold text-sm"
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
