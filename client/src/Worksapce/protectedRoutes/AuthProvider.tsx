import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { logoutUserAuth, setUserAuth } from "../../Redux/feature/AuthSlice";
import apiService from "../../Services/apiServices/apiService";
import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { persistor } from "../../Redux/store";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkAuth = async () => {
      try {
        const res = await apiService.get("/auth/user/me");
        console.log(res, "AUTH ME response");
        dispatch(setUserAuth(res.data));   // adjust according to your actual response shape
      } catch (err: any) {
        console.log("Auth check failed - user not logged in");
        await persistor.purge();
        dispatch(logoutUserAuth());
        <Navigate to="/login" replace />
      } finally {
        setLoading(false);
      }
    };

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