import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { logoutUserAuth,setUserAuth } from "../../Redux/feature/AuthSlice";
import apiService from "../../Services/apiServices/apiService";
import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { persistor } from "../../Redux/store";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await apiService.get("/auth/user/me");
     
        dispatch(setUserAuth(res.data));   // adjust according to your actual response shape
      } catch (err: unknown) {
        await persistor.purge();
        dispatch(logoutUserAuth());
        <Navigate to="/login" replace />
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
