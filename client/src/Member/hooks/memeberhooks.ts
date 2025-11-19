import { useSelector } from "react-redux";
export   const useMember=()=> useSelector((state: RootState) => state?.user?.user);
