import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const user = auth.currentUser;

  // Jika tidak ada user, arahkan ke login
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
