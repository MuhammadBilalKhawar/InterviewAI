import React, { useState } from "react";
import NavBar from "../components/NavBar";

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
      const res = await fetch(
        "https://interviewai-zmzj.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

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
    <div className="min-h-screen bg-gradient-to-r from-amber-900 via-black to-slate-950 text-white flex flex-col">
      <NavBar mode="auth" active="register" />

      <main className="flex-1 flex flex-col items-center justify-start px-3 sm:px-6 py-6 sm:py-12">
        <div className="max-w-2xl w-full text-center">
          <div className="flex justify-center mb-4 sm:mb-6 animate-float">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/50 hover:shadow-lg hover:shadow-amber-500/70 transition-all duration-300">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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

          <h1 className="text-2xl sm:text-4xl font-extrabold animate-fade-in">Get Started</h1>
          <p className="mt-2 text-xs sm:text-base text-slate-400 animate-slide-in-down" style={{ animationDelay: '0.1s' }}>
            Create your Interview Grader account
          </p>

          <div className="mt-6 sm:mt-8 mx-auto max-w-md">
            <form onSubmit={handleSubmit}>
              <div className="bg-slate-900/50 rounded-2xl p-6 sm:p-8 shadow-2xl ring-1 ring-amber-500/20 text-left">
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
                    className="w-full bg-slate-950/60 border border-amber-500/30 rounded-md px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
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
                    className="w-full bg-slate-950/60 border border-amber-500/30 rounded-md px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
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
                    className="w-full bg-slate-950/60 border border-amber-500/30 rounded-md px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
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
                    className="w-full bg-slate-950/60 border border-amber-500/30 rounded-md px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-md font-semibold transition"
                >
                  {loading ? "Creating..." : "Create Account →"}
                </button>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 border-t border-slate-700"></div>
                  <span className="text-slate-400 text-sm">Or sign up with</span>
                  <div className="flex-1 border-t border-slate-700"></div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a
                    href="https://interviewai-zmzj.onrender.com/api/oauth/google"
                    className="flex items-center justify-center gap-2 bg-white text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </a>

                  <a
                    href="https://interviewai-zmzj.onrender.com/api/oauth/github"
                    className="flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-md font-semibold hover:bg-slate-700 transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </form>

            <div className="mt-6 border-t border-slate-700 pt-4 text-center text-slate-400 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-amber-400 hover:text-amber-300">
                Sign in here
              </a>
            </div>
          </div>

          <div className="mt-8 space-y-3 text-left text-slate-300">
            <div className="flex items-start gap-3">
              <div className="text-amber-400">✓</div>
              <div>AI-powered interview feedback</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-amber-400">✓</div>
              <div>Practice unlimited interviews</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-amber-400">✓</div>
              <div>Track your progress over time</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
