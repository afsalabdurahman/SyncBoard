import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
export const usePlankey =()=> useSelector((state:RootState)=>state.suscription.subscription.planKey)
export   const useAdminId   =()=> useSelector((state: RootState) => state?.user?.user?._id);
export   const useAdminName =()=> useSelector((state: RootState) => state?.user?.user?.name);
export const useUserFilter =()=> useSelector((state: RootState) => state.users.filter);
export const useProjects = () => useSelector((state:RootState)=>state.projects.list);
export const usePagination = () => useSelector((state:RootState)=>state.projects)
