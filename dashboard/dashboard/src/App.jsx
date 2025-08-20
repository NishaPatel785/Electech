import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayoutAccount from "./section/Dashboard/Dashboard";
import LoginPage from "../src/section/Login/Login";
import AdminProtectedRoute from "./section/Admin/Admin";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("refreshToken");
    setToken(storedToken);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route
          path="/dashboard"
          element={
            <AdminProtectedRoute>
              <DashboardLayoutAccount />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
