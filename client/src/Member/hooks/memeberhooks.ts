import { useSelector } from "react-redux";
import { store, type RootState } from "../../Redux/store";
export const useMember = () => useSelector((state: RootState) => state?.user?.user);
export const  getMemberDataBasedWorkspace=()=>{
    const user = store.getState().user.user;
    const workspace = store.getState().workspace.workspace;
    const memberDetails = workspace?.members.find(
  member => member.userId.toString() === user._id.toString()
);
return memberDetails
}