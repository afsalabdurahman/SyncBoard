import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query"; // Fix: usually it's from your store

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Optional: Add a small check if you have user data too
  const user = useSelector((state: RootState) => state.auth.user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;