import React from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Practice from "./pages/Practice";
import History from "./pages/History";
import CreateQuestion from "./pages/CreateQuestion";
import ListQuestions from "./pages/ListQuestions";

export default function App() {
  const path = window.location.pathname;
  if (path === "/login") return <Login />;
  if (path === "/register") return <Register />;
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
  if (path === "/create-question") return <CreateQuestion />;
  if (path === "/list-questions") return <ListQuestions />;
  return <Landing />;
}
