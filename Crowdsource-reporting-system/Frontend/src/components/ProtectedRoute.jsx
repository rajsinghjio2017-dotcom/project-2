import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user has a valid token in localStorage
  const token = localStorage.getItem("token");

  // If no token, show alert and redirect to login page
  if (!token) {
    alert("Please login first to access this page.");
    return <Navigate to="/login" replace />;
  }

  // Otherwise, allow access to the protected route
  return children;
};

export default ProtectedRoute;
