import { useSelector } from "react-redux"
import { RootState } from "../../Redux/store";
export const useWorkspaceid = () => useSelector((state:RootState)=>state.workspace.workspace._id)
export const useWorkspaceName = () =>useSelector((state:RootState)=>state.workspace.workspace.name)