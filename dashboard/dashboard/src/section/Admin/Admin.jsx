import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user || user.is_admin !== 1) {
    return <Navigate to="/" />; // redirect to home if not admin
  }

  return children;
};

export default AdminProtectedRoute;
