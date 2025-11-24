import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-slate-800/30 rounded-xl p-6 min-w-[12rem]">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-md bg-slate-900/50 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="text-sm text-slate-300">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAnswers();
  }, []);

  async function fetchAnswers() {
    try {
      const res = await fetch(`${API_BASE}/answers/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAnswers(data);
      }
    } catch (err) {
      console.error("Failed to fetch answers:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // Calculate dashboard stats from real data
  const totalAnswers = answers.length;
  const avgScore = answers.length
    ? Math.round(
        answers.reduce((sum, a) => sum + a.score.overall, 0) / answers.length
      )
    : 0;
  const lastPracticeDate = answers.length
    ? new Date(answers[0]?.createdAt).toLocaleDateString()
    : "Never";
  const thisWeekCount = answers.filter((a) => {
    const answerDate = new Date(a.createdAt);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return answerDate >= sevenDaysAgo;
  }).length;

  // Calculate average scores by category
  const clarityScores = answers.map((a) => a.score.clarity);
  const relevanceScores = answers.map((a) => a.score.relevance);
  const depthScores = answers.map((a) => a.score.depth);
  const structureScores = answers.map((a) => a.score.structure);

  const avgClarity = clarityScores.length
    ? Math.round(
        clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length
      )
    : 0;
  const avgRelevance = relevanceScores.length
    ? Math.round(
        relevanceScores.reduce((a, b) => a + b, 0) / relevanceScores.length
      )
    : 0;
  const avgDepth = depthScores.length
    ? Math.round(depthScores.reduce((a, b) => a + b, 0) / depthScores.length)
    : 0;
  const avgStructure = structureScores.length
    ? Math.round(
        structureScores.reduce((a, b) => a + b, 0) / structureScores.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-sky-400">InterviewAI</div>
          <nav className="flex items-center gap-6">
            <a href="/dashboard" className="text-sky-300 font-medium">
              Dashboard
            </a>
            <a href="/practice" className="text-slate-300">
              Practice
            </a>
            <a href="/history" className="text-slate-300">
              History
            </a>
            <div className="ml-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center">
                {(user.name || "")[0] || "J"}
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 bg-slate-700/60 hover:bg-slate-700/80 rounded text-sm text-white"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-extrabold">
          Welcome back, {user.name || "John"}
        </h2>
        <p className="text-slate-300 mt-2">
          Track your progress and improve your interview skills
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={
              <svg
                className="w-6 h-6 text-sky-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m4-2v6m0 0h.01M17 9V7a3 3 0 00-3-3h-2a3 3 0 00-3 3v2"
                />
              </svg>
            }
            title="Total Answers"
            value={totalAnswers}
          />
          <StatCard
            icon={
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3v18h18"
                />
              </svg>
            }
            title="Average Score"
            value={`${avgScore}%`}
          />
          <StatCard
            icon={
              <svg
                className="w-6 h-6 text-pink-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3M3 11h18"
                />
              </svg>
            }
            title="Last Practice"
            value={lastPracticeDate}
          />
          <StatCard
            icon={
              <svg
                className="w-6 h-6 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3v18h18"
                />
              </svg>
            }
            title="This Week"
            value={thisWeekCount}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold">Performance Metrics</h3>
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Clarity</span>
                  <span>{avgClarity}%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full mt-2">
                  <div
                    className="h-3 bg-linear-to-r from-sky-500 to-indigo-400 rounded-full"
                    style={{ width: `${avgClarity}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Relevance</span>
                  <span>{avgRelevance}%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full mt-2">
                  <div
                    className="h-3 bg-linear-to-r from-sky-500 to-indigo-400 rounded-full"
                    style={{ width: `${avgRelevance}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Technical Depth</span>
                  <span>{avgDepth}%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full mt-2">
                  <div
                    className="h-3 bg-linear-to-r from-sky-500 to-indigo-400 rounded-full"
                    style={{ width: `${avgDepth}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Structure</span>
                  <span>{avgStructure}%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full mt-2">
                  <div
                    className="h-3 bg-linear-to-r from-sky-500 to-indigo-400 rounded-full"
                    style={{ width: `${avgStructure}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Quick Actions</h3>
              <button onClick={handleLogout} className="text-sm text-slate-300">
                Logout
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <a
                href="/practice"
                className="block w-full text-left bg-linear-to-r from-sky-500 to-indigo-600 text-white py-3 rounded-md"
              >
                Start Practice →
              </a>
              <a
                href="#"
                className="block w-full text-left bg-slate-900/30 text-white py-3 rounded-md"
              >
                View History →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
