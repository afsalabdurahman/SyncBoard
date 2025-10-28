import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
export const useUsers = () => useSelector((state:RootState)=>state.alluser.users)
export const usePaginationUser = () => useSelector((state:RootState)=>state.alluser)