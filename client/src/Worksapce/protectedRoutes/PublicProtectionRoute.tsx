import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

const PublicProtectionRoute = ({ children }: { children: React.ReactNode }) => {
  const email = useSelector(
    (state: RootState) => state?.user?.user?.email
  );
  if (email) {
    return <Navigate to="/workspace" replace />;
  }

  return <>{children}</>;
};

export default PublicProtectionRoute;
