import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        "https://interviewai-zmzj.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white flex flex-col">
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-xl font-bold text-sky-400">InterviewAI</div>
        <div className="space-x-4 flex items-center">
          <a href="/login" className="text-sm text-slate-300 hover:text-white">
            Login
          </a>
          <a
            href="/register"
            className="ml-2 bg-sky-500 text-white px-4 py-2 rounded-full inline-block"
          >
            Register
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-xl w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold">Welcome Back</h1>
          <p className="mt-2 text-slate-300">
            Sign in to your Interview Grader account
          </p>

          <form onSubmit={handleSubmit} className="mt-8 mx-auto max-w-md">
            <div className="bg-slate-800/40 rounded-2xl p-8 shadow-2xl ring-1 ring-slate-700 text-left">
              {error && <div className="mb-4 text-rose-400">{error}</div>}
              <label className="block text-slate-300 text-sm mb-2">
                Email Address
              </label>
              <div className="mb-6">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-md px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <label className="block text-slate-300 text-sm mb-2">
                Password
              </label>
              <div className="mb-4">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="●●●●●●●"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-md px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="text-right mb-6">
                <a href="#" className="text-sm text-sky-400">
                  Forgot password?
                </a>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 rounded-md font-semibold"
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>

              <div className="mt-6 border-t border-slate-700 pt-4 text-center text-slate-400 text-sm">
                New to Interview Grader?{" "}
                <a href="/register" className="text-sky-400">
                  Create an account here
                </a>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
