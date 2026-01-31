import React from "react";
import NavBar from "../components/NavBar";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-900 via-black to-slate-950 text-white">
      <NavBar mode="public" active="" />

      <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <section>
          <span className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full text-sm mb-6 border border-amber-500/20">
            <svg
              className="w-4 h-4 text-amber-400"
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
            <span className="text-amber-400">with AI Feedback</span>
          </h1>

          <p className="mt-6 text-slate-400 max-w-xl">
            Practice with real interview questions, get instant AI-powered
            feedback, and track your progress with detailed analytics.
          </p>

          <div className="mt-8 flex justify-start">
            <a
              href="/register"
              className="relative group inline-block px-8 py-3 rounded-full bg-amber-500 text-black font-bold text-lg shadow-lg shadow-amber-500/50 overflow-hidden hover:bg-amber-400 transition"
              style={{ transition: "all 0.3s" }}
            >
              <span className="relative z-10">Get Started →</span>
            </a>
          </div>

          <div className="mt-12 flex gap-12 text-slate-400">
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
          <div className="w-full max-w-md bg-slate-900/50 rounded-2xl p-8 shadow-2xl ring-1 ring-amber-500/20">
            <div className="text-slate-400 text-sm mb-4">Interviewer</div>
            <div className="bg-slate-950 p-4 rounded-lg">
              <div className="text-slate-300 mb-3">
                Tell me about your recent project experience.
              </div>
              <div className="text-slate-400 text-sm mb-2">You</div>
              <div className="bg-slate-800/60 text-amber-200 p-4 rounded-lg">
                I recently led a project where we implemented...
              </div>

              <div className="mt-4 bg-amber-500/15 text-amber-100 p-3 rounded-lg border border-amber-500/30">
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
