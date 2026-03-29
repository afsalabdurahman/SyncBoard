import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { logoutUserAuth, setUserAuth } from "../../Redux/feature/AuthSlice";
import apiService from "../../Services/apiServices/apiService";
import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";

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
        dispatch(setUserAuth(res.data.user));
      } catch {
        dispatch(logoutUserAuth());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);
console.log("**************")
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