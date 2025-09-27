import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthProvider";
import LoadingAnimation from "../components/shared/LoadingAnimation";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
