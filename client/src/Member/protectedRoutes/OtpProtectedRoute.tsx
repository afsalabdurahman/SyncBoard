import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const OtpProtectedRoute = ({ children }: Props) => {
  const email = useSelector(
    (state: RootState) => state?.user?.user?.email
  );

  if (!email) {
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
};

export default OtpProtectedRoute;
