import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
export const useMember = () => useSelector((state: RootState) => state?.user?.user);
