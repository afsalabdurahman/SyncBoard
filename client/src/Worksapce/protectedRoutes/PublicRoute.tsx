import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/workspace" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
