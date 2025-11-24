import React from "react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
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

      <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <section>
          <span className="inline-flex items-center gap-2 bg-slate-800/30 text-sky-300 px-3 py-1 rounded-full text-sm mb-6">
            <svg
              className="w-4 h-4 text-sky-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m4-2v6m0 0h.01M17 9V7a3 3 0 00-3-3h-2a3 3 0 00-3 3v2"
              />
            </svg>
            AI-Powered Interview Training
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Master Interviews{" "}
            <span className="text-sky-400">with AI Feedback</span>
          </h1>

          <p className="mt-6 text-slate-300 max-w-xl">
            Practice with real interview questions, get instant AI-powered
            feedback, and track your progress with detailed analytics.
          </p>

          <div className="mt-8 flex justify-start">
            <a
              href="/register"
              className="relative group inline-block px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white font-bold text-lg shadow-lg overflow-hidden"
              style={{ transition: "box-shadow 0.3s" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition duration-500 blur-lg"></span>
              <span className="relative z-10 animate-pulse">Get Started →</span>
            </a>
          </div>

          <div className="mt-12 flex gap-12 text-slate-300">
            <div>
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-sm">Interview Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">95%</div>
              <div className="text-sm">Success Rate</div>
            </div>
          </div>
        </section>

        <aside className="flex justify-center md:justify-end">
          <div className="w-full max-w-md bg-slate-800/40 rounded-2xl p-8 shadow-2xl ring-1 ring-slate-700">
            <div className="text-slate-400 text-sm mb-4">Interviewer</div>
            <div className="bg-slate-900 p-4 rounded-lg">
              <div className="text-slate-300 mb-3">
                Tell me about your recent project experience.
              </div>
              <div className="text-slate-400 text-sm mb-2">You</div>
              <div className="bg-slate-700/60 text-sky-200 p-4 rounded-lg">
                I recently led a project where we implemented...
              </div>

              <div className="mt-4 bg-emerald-700/80 text-emerald-50 p-3 rounded-lg">
                <div className="font-semibold">✓ AI Feedback</div>
                <div className="text-sm mt-1">
                  Clear communication, good structure, add more technical depth
                </div>
                <div className="mt-2 text-sm">
                  Clarity: <span className="font-bold">8.5/10</span> Relevance:{" "}
                  <span className="font-bold">8.0/10</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
