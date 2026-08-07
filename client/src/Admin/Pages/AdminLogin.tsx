import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../Redux/feature/user/userSlice";
import { setWorkspace } from "../../Redux/feature/WorkspaceSlice";
import { setSubscription } from "../../Redux/feature/subscription/subscriptionSlice";
import { setUserAuth } from "../../Redux/feature/AuthSlice";
import { useWorkspaceid } from "../../Worksapce/hooks/workspacehooks";
import apiService from "../../Services/apiServices/apiService";
import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";
import { ROUTES } from "../../Constants/routeConstan";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workspaceId = useWorkspaceid() as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) return;

    const adminLogin = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.post(
          ROUTES.PUBLIC.ADMIN_LOGIN+"/"+workspaceId
   
         
        );

        console.log(response.data, "response+++");

        dispatch(setUserAuth(response.data?.user?._id));
        dispatch(setWorkspace(response.data.workspace));
        dispatch(setSubscription(response.data.suscribe));
        dispatch(setUserData(response.data.user));

        navigate("/admin/dashboard");
      } catch (err: any) {
        console.error("Admin login failed:", err);
        setError(
          err?.response?.data?.message || "Login failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    adminLogin();
  }, [workspaceId, dispatch, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Fallback (shouldn't normally reach here because of navigate)
  return null;
};

export default AdminLogin;