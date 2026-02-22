import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { logoutUserAuth,setUserAuth } from "../../Redux/feature/AuthSlice";
import apiService from "../../Services/apiServices/apiService";
import { findEmail } from "../../Member/apiservice/authApi";
import { toast } from "react-toastify";
import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await apiService.get("/auth/user/me",{},{withCredentials:true});
  
        dispatch(setUserAuth(res.data.user));
      } catch {
        console.log("workinggCathc in authProvider")
        
        dispatch(logoutUserAuth());
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [dispatch]);

  if (loading) return  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <LoadingSpinner />
    </div>

  return <>{children}</>;
};

export default AuthProvider;
