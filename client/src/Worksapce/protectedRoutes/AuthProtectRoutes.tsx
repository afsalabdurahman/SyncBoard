import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { findEmail } from "../../Member/apiservice/authApi";



interface Props {
  children: React.ReactNode;
}

const AuthProtectRoutes = ({ children }: Props) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const email = useSelector(
    (state: RootState) => state?.user?.user?.email
  );
  console.log(email,"email")

  useEffect(() => {
    async function authUser() {
      try {
        const foundUser = await findEmail(email);
        if (foundUser) {
          setUser(foundUser);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (email) {
      authUser();
    } else {
      setLoading(false);
    }
  }, [email]);

  if (loading) return <div>Loading...</div>;
console.log(user,"userss")
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthProtectRoutes;
