import { useSelector } from "react-redux"
import { RootState } from "../../Redux/store";
export const useWorkspaceid = () => useSelector((state:RootState)=>state.workspace.workspace._id)
export const useWorkspaceName = () =>useSelector((state:RootState)=>state.workspace.workspace.name);
export const useWorkspaceSlug = ()=>useSelector((state:RootState)=>state.workspace.workspace.slug)
export const useUser = () => useSelector((state:RootState)=>state.user.user)
// eslint-disable-next-line react-hooks/rules-of-hooks
export const userPermission =()=> useSelector((state:RootState)=>state.user.permissions)  


export const useUserBasedWorkspace = (userId: string | null | undefined) => {
 
  return useSelector((state: RootState) => {
    if (!userId) return null;

    return state.workspace.workspace?.members?.filter(
      (member) => member.userId === userId
    ) || null;
  });
};