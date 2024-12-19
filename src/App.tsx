import React from "react";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Register from "./page/Register";
import ProtectedRoute from "./protect/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
