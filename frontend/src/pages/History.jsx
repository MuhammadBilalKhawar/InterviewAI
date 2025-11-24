import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

function StatCard({ title, value }) {
  return (
    <div className="bg-slate-800/30 rounded-xl p-6 mb-6">
      <div className="text-sm text-slate-300">{title}</div>
      <div className="text-2xl font-bold mt-4">{value}</div>
    </div>
  );
}

export default function History() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/answers/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setAnswers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const avgScore = answers.length
    ? Math.round(
        answers.reduce((sum, a) => sum + a.score.overall, 0) / answers.length
      )
    : 0;
  const bestScore = answers.length
    ? Math.max(...answers.map((a) => a.score.overall))
    : 0;
  const worstScore = answers.length
    ? Math.min(...answers.map((a) => a.score.overall))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white flex items-center justify-center">
        <p className="text-lg text-slate-300">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4 bg-red-900/30 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <header className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-sky-400">InterviewAI</div>
        <nav className="flex items-center gap-6">
          <a href="/dashboard" className="text-slate-300">
            Dashboard
          </a>
          <a href="/practice" className="text-slate-300">
            Practice
          </a>
          <a href="/history" className="text-sky-300 font-medium">
            History
          </a>
          <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center">
            J
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <h1 className="text-4xl font-extrabold mb-6">Answer History</h1>

          {answers.length === 0 ? (
            <div className="bg-slate-800/40 rounded-2xl p-8 text-center text-slate-400">
              <p>No answers yet. Start practicing to see your history!</p>
            </div>
          ) : (
            <div className="bg-slate-800/40 rounded-2xl overflow-hidden ring-1 ring-slate-700">
              <table className="w-full text-left table-fixed">
                <thead className="bg-slate-900/40 text-slate-300">
                  <tr>
                    <th className="px-6 py-4 w-2/5">Question</th>
                    <th className="px-6 py-4 w-1/5">Category</th>
                    <th className="px-6 py-4 w-1/5">Date</th>
                    <th className="px-6 py-4 w-1/5">Score</th>
                  </tr>
                </thead>

                <tbody className="text-slate-200 divide-y divide-slate-700">
                  {answers.map((answer) => (
                    <tr
                      key={answer._id}
                      className="align-top hover:bg-slate-700/20 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="font-medium">
                          {answer.question?.text || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-400">
                        {answer.question?.category || "N/A"}
                      </td>
                      <td className="px-6 py-5 text-slate-300">
                        {new Date(answer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-block bg-emerald-700/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">
                          {Math.round(answer.score.overall)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="lg:col-span-1">
          <StatCard title="Average Score" value={`${avgScore}%`} />
          <StatCard title="Best Score" value={`${bestScore}%`} />
          <StatCard title="Total Attempts" value={answers.length} />
          <StatCard title="Lowest Score" value={`${worstScore}%`} />
        </aside>
      </main>
    </div>
  );
}
