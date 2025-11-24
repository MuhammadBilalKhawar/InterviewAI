import React, { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all required fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => null);
      console.log("[register] status", res.status, "body", data);

      if (!res.ok) {
        const msg =
          (data && data.message) ||
          `Registration failed (status ${res.status})`;
        throw new Error(msg);
      }

      if (data && data.token) localStorage.setItem("token", data.token);
      if (data && data.user)
        localStorage.setItem("user", JSON.stringify(data.user));

      // successful registration -> go to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("[register] error", err);
      setError(err?.message || "Registration failed");
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

      <main className="flex-1 flex flex-col items-center justify-start px-6 pt-12">
        <div className="max-w-2xl w-full text-center">
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

          <h1 className="text-4xl font-extrabold">Get Started</h1>
          <p className="mt-2 text-slate-300">
            Create your Interview Grader account
          </p>

          <div className="mt-8 mx-auto max-w-md">
            <form onSubmit={handleSubmit}>
              <div className="bg-slate-800/40 rounded-2xl p-8 shadow-2xl ring-1 ring-slate-700 text-left">
                {error && <div className="mb-4 text-rose-400">{error}</div>}

                <label className="block text-slate-300 text-sm mb-2">
                  Full Name
                </label>
                <div className="mb-4">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-md px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <label className="block text-slate-300 text-sm mb-2">
                  Email Address
                </label>
                <div className="mb-4">
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

                <label className="block text-slate-300 text-sm mb-2">
                  Confirm Password
                </label>
                <div className="mb-6">
                  <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    type="password"
                    placeholder="●●●●●●●"
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-md px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-md font-semibold"
                >
                  {loading ? "Creating..." : "Create Account →"}
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-slate-700 pt-4 text-center text-slate-400 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-sky-400">
                Sign in here
              </a>
            </div>
          </div>

          <div className="mt-8 space-y-3 text-left text-slate-300">
            <div className="flex items-start gap-3">
              <div className="text-emerald-400">✓</div>
              <div>AI-powered interview feedback</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-emerald-400">✓</div>
              <div>Practice unlimited interviews</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-emerald-400">✓</div>
              <div>Track your progress over time</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
