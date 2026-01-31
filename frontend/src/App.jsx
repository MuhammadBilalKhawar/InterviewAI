import React, { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Practice from "./pages/Practice";
import History from "./pages/History";
import CreateQuestion from "./pages/CreateQuestion";
import ListQuestions from "./pages/ListQuestions";
import AuthCallback from "./pages/AuthCallback";
import Profile from "./pages/Profile";

export default function App() {
  const path = window.location.pathname;
  if (path === "/") return <LandingWithSplash />;
  if (path === "/login") return <Login />;
  if (path === "/register") return <Register />;
  if (path === "/auth/callback") return <AuthCallback />;
  if (path === "/dashboard") {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      user = null;
    }
    if (user && user.role === "admin") return <AdminDashboard />;
    return <Dashboard />;
  }
  if (path === "/practice") return <Practice />;
  if (path === "/history") return <History />;
  if (path === "/profile") return <Profile />;
  if (path === "/create-question") return <CreateQuestion />;
  if (path === "/list-questions") return <ListQuestions />;
  return <Landing />;
}

function LandingWithSplash() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && (
        <div className="splash-overlay">
          <div className="splash-content">
            <div className="splash-title">InterviewAI</div>
            <div className="splash-subtitle">Practice. Improve. Get hired.</div>
          </div>
        </div>
      )}
      <div className={showSplash ? "splash-blur" : ""}>
        <Landing />
      </div>
    </>
  );
}
