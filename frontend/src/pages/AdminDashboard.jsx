import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

function Stat({ title, value, icon, delay = 0 }) {
  return (
    <div className="bg-slate-800/30 rounded-xl p-6 animate-slide-in-up hover:bg-slate-800/50 hover:ring-1 hover:ring-amber-500/20 transition-all duration-300" style={{ animationDelay: `${delay * 100}ms` }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-md bg-slate-900/50 flex items-center justify-center">
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

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    questions: 0,
    users: 0,
    submissions: 0,
    avgScore: 0,
    popularCategory: "",
    hardCount: 0,
    recentUsers: 0,
    recentSubmissions: 0,
    difficultyDist: { Easy: 0, Medium: 0, Hard: 0 },
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  async function fetchStats() {
    try {
      const [questionsRes, usersRes, submissionsRes] = await Promise.all([
        fetch("https://interviewai-zmzj.onrender.com/api/questions/list", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://interviewai-zmzj.onrender.com/api/users/list", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://interviewai-zmzj.onrender.com/api/answers/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const questions = (await questionsRes.json()) || [];
      const users = (await usersRes.json()) || [];
      const submissions = (await submissionsRes.json()) || [];

      // Most popular category
      const categoryCount = {};
      let hardCount = 0;
      let difficultyDist = { Easy: 0, Medium: 0, Hard: 0 };
      questions.forEach((q) => {
        categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
        if (q.difficulty === "Hard") hardCount++;
        if (difficultyDist[q.difficulty] !== undefined)
          difficultyDist[q.difficulty]++;
      });
      const popularCategory =
        Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        "N/A";

      // Recent user registrations (last 7 days)
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recentUsers = users.filter(
        (u) => new Date(u.createdAt) >= sevenDaysAgo
      ).length;

      // Recent submissions (last 7 days)
      const recentSubmissions = submissions.filter(
        (s) => new Date(s.createdAt) >= sevenDaysAgo
      ).length;

      // Average score
      let avgScore = 0;
      if (submissions.length > 0) {
        avgScore = Math.round(
          submissions.reduce((sum, a) => sum + (a.score?.overall || 0), 0) /
            submissions.length
        );
      }

      setStats({
        questions: questions.length,
        users: users.length,
        submissions: submissions.length,
        avgScore,
        popularCategory,
        hardCount,
        recentUsers,
        recentSubmissions,
        difficultyDist,
      });
    } catch (err) {
      // fallback: keep stats at 0
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-900 via-black to-slate-950 text-white">
      <NavBar mode="admin" active="admin" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold animate-fade-in">Admin Dashboard</h1>
        <p className="text-slate-400 mt-2 animate-slide-in-down" style={{ animationDelay: '0.1s' }}>
          Monitor and manage the Interview Grader platform
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <Stat
            title="Total Questions"
            value={stats.questions}
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
                  d="M9 12h6m2 0a2 2 0 100-4H7a2 2 0 100 4h10z"
                />
              </svg>
            }
          />
          <Stat
            title="Total Users"
            value={stats.users}
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
                  d="M5 12h14M12 5v14"
                />
              </svg>
            }
          />
          <Stat
            title="Total Submissions"
            value={stats.submissions}
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
                  d="M3 10h18M3 6h18M3 14h18"
                />
              </svg>
            }
          />
          <Stat
            title="Avg. Score"
            value={stats.avgScore + "%"}
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
                  d="M3 12h18M12 3v18"
                />
              </svg>
            }
          />
        </div>

        <div className="mt-8">
          <button
            onClick={() => (window.location.href = "/list-questions")}
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-md font-semibold"
          >
            Manage Questions
          </button>
        </div>

        <div className="mt-8 bg-slate-800/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold">Platform Insights</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/40 rounded-lg p-6">
              <div className="text-sm text-slate-300">
                Most Popular Category
              </div>
              <div className="text-2xl font-bold mt-4">
                {stats.popularCategory}
              </div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-6">
              <div className="text-sm text-slate-300">Hardest Questions</div>
              <div className="text-2xl font-bold mt-4">{stats.hardCount}</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-6">
              <div className="text-sm text-slate-300">
                Recent User Registrations
              </div>
              <div className="text-2xl font-bold mt-4">{stats.recentUsers}</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-6">
              <div className="text-sm text-slate-300">Recent Submissions</div>
              <div className="text-2xl font-bold mt-4">
                {stats.recentSubmissions}
              </div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-6">
              <div className="text-sm text-slate-300">Question Difficulty</div>
              <div className="text-base mt-4">
                <span className="mr-4">Easy: {stats.difficultyDist.Easy}</span>
                <span className="mr-4">
                  Medium: {stats.difficultyDist.Medium}
                </span>
                <span>Hard: {stats.difficultyDist.Hard}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
