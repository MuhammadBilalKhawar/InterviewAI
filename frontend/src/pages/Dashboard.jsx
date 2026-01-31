import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

const API_BASE = "https://interviewai-zmzj.onrender.com/api";

function StatCard({ icon, title, value, delay = 0 }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 sm:p-6 min-w-[8rem] sm:min-w-[12rem] ring-1 ring-amber-500/20 hover:ring-amber-500/40 transition animate-slide-in-up" style={{ animationDelay: `${delay * 100}ms` }}>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-amber-500/10 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <div className="text-xs sm:text-sm text-slate-400">{title}</div>
          <div className="text-lg sm:text-2xl font-bold text-amber-400">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [answers, setAnswers] = useState([]);
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);
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
    fetchRecommendedQuestions();

    // Refresh recommendations when user returns to dashboard
    const handleFocus = () => {
      fetchRecommendedQuestions();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
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

  async function fetchRecommendedQuestions() {
    try {
      const res = await fetch(`${API_BASE}/questions/recommended`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendedQuestions(data);
      }
    } catch (err) {
      console.error("Failed to fetch recommended questions:", err);
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
    <div className="min-h-screen bg-gradient-to-r from-amber-900 via-black to-slate-950 text-white">
      <NavBar mode="app" active="dashboard" />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold">
          Welcome back, {user.name || "John"}
        </h2>
        <p className="text-xs sm:text-base text-slate-300 mt-2">
          Track your progress and improve your interview skills
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
          <StatCard
            delay={0}
            icon={
              <svg
                className="w-6 h-6 text-amber-400"
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
            delay={1}
            icon={
              <svg
                className="w-6 h-6 text-amber-400"
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
            delay={2}
            icon={
              <svg
                className="w-6 h-6 text-amber-400"
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
            delay={3}
            icon={
              <svg
                className="w-6 h-6 text-amber-400"
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

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-slate-900/50 rounded-xl p-6 ring-1 ring-amber-500/20 animate-slide-in-left hover:ring-amber-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold">Performance Metrics</h3>
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Clarity</span>
                  <span>{avgClarity}%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full mt-2">
                  <div
                    className="h-3 bg-amber-500 rounded-full"
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
                    className="h-3 bg-amber-500 rounded-full"
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
                    className="h-3 bg-amber-500 rounded-full"
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
                    className="h-3 bg-amber-500 rounded-full"
                    style={{ width: `${avgStructure}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-6 ring-1 ring-amber-500/20 animate-slide-in-right hover:ring-amber-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Quick Actions</h3>
              <button onClick={handleLogout} className="text-sm text-slate-300">
                Logout
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <a
                href="/practice"
                className="block w-full text-left bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-md font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 active:scale-95"
              >
                Start Practice →
              </a>
              <a
                href="/history"
                className="block w-full text-left bg-slate-900/30 text-white py-3 rounded-md transition-all duration-300 hover:bg-slate-800/50 hover:translate-x-1 active:scale-95"
              >
                View History →
              </a>
            </div>
          </div>
        </div>

        {/* Recommended Questions Section */}
        <div className="mt-8 bg-slate-900/50 rounded-xl p-6 ring-1 ring-amber-500/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">Recommended Questions for You</h3>
            <a href="/profile" className="text-sm text-amber-400 hover:text-amber-300">
              Update interests →
            </a>
          </div>
          {recommendedQuestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">
                No recommendations yet. Add your interests in your profile to get personalized question recommendations!
              </p>
              <a
                href="/profile"
                className="inline-block bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-md font-semibold"
              >
                Set Your Interests
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedQuestions.map((question, index) => (
                <div
                  key={question._id}
                  className={`bg-slate-800/50 rounded-lg p-5 hover:ring-2 hover:ring-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 animate-scale-in stagger-${(index % 5) + 1}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        question.difficulty === "Easy"
                          ? "bg-green-500/20 text-green-400"
                          : question.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                    <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                      {question.category}
                    </span>
                  </div>
                  <p className="text-white mb-4">{question.text}</p>
                  <a
                    href={`/practice?q=${question._id}`}
                    className="inline-block text-sm text-amber-400 hover:text-amber-300 font-medium"
                  >
                    Practice this question →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
