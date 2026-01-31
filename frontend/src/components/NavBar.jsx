import React from "react";

const baseContainer =
  "max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center bg-black/40 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-lg shadow-black/40 flex-wrap gap-2 sm:gap-4";
const pillBase =
  "px-2 sm:px-3 py-2 rounded-full transition text-xs sm:text-sm font-medium";
const pillActive =
  "text-amber-300 bg-amber-500/10 border border-amber-500/20";
const pillIdle =
  "text-slate-300 hover:text-amber-300 hover:bg-amber-500/10";

export default function NavBar({ mode = "public", active = "" }) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const renderPublicLinks = () => (
    <div className="flex items-center gap-3">
      <a
        href="/login"
        className={`${pillBase} ${
          active === "login" ? pillActive : pillIdle
        }`}
      >
        Login
      </a>
      <a
        href="/register"
        className="ml-1 bg-amber-500 text-black px-4 py-2 rounded-full inline-block font-semibold hover:bg-amber-400 transition shadow shadow-amber-500/40"
      >
        Register
      </a>
    </div>
  );

  const renderAppLinks = () => (
    <nav className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
      <a
        href="/dashboard"
        className={`${pillBase} ${
          active === "dashboard" ? pillActive : pillIdle
        }`}
      >
        Dashboard
      </a>
      <a
        href="/practice"
        className={`${pillBase} ${
          active === "practice" ? pillActive : pillIdle
        }`}
      >
        Practice
      </a>
      <a
        href="/history"
        className={`${pillBase} ${
          active === "history" ? pillActive : pillIdle
        }`}
      >
        History
      </a>
      <div className="ml-auto sm:ml-2 flex items-center gap-2 sm:gap-3">
        <a
          href="/profile"
          className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm ${
            active === "profile"
              ? "bg-amber-600 text-white"
              : "bg-amber-500 text-black hover:bg-amber-400"
          } transition`}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-7 h-7 sm:w-9 sm:h-9 rounded-full" />
          ) : (
            (user?.name || "J")[0]
          )}
        </a>
        <button
          onClick={handleLogout}
          className="text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 px-2 sm:px-3 py-2 rounded-full text-xs sm:text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );

  const renderAdminLinks = () => (
    <nav className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
      <a
        href="/dashboard"
        className={`${pillBase} ${
          active === "admin" ? pillActive : pillIdle
        }`}
      >
        Dashboard
      </a>
      <a
        href="/create-question"
        className={`${pillBase} ${
          active === "create-question" ? pillActive : pillIdle
        }`}
      >
        Create
      </a>
      <a
        href="/list-questions"
        className={`${pillBase} ${
          active === "list-questions" ? pillActive : pillIdle
        }`}
      >
        Questions
      </a>
      <button
        onClick={handleLogout}
        className="text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 px-2 sm:px-3 py-2 rounded-full text-xs sm:text-sm transition ml-auto sm:ml-0"
      >
        Logout
      </button>
    </nav>
  );

  return (
    <header className={baseContainer}>
      <div className="text-xl font-bold text-amber-400">InterviewAI</div>
      {mode === "public" && renderPublicLinks()}
      {mode === "auth" && renderPublicLinks()}
      {mode === "app" && renderAppLinks()}
      {mode === "admin" && renderAdminLinks()}
    </header>
  );
}
