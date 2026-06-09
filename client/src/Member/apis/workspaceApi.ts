import apiService from "../../Services/apiServices/apiService"
import { catchErrorHandle } from "../../Utility/catchErrorHandle"
import {ROUTES} from "../../Constants/routeConstan"
export const createWorkspace = async(email:string,workspaceName:string,slug:string,title:string,role:string,ownerId:string) =>{
    try {
        const response = await apiService.post(ROUTES.WORKSPACE.CREATE_WORKSPACE,{
            email,
          workspaceName,
          slug,
          title,
          role,
          ownerId
        }) 
        return response
    } catch (error) {
        const err: string = catchErrorHandle(error, "Workspace creation failed")
            throw new Error(err)
    }
}
export const sendInvitaionMail = async(workspaceId:string,emails:string|null,invitationLink:string)=>{
     try {
         const response = await apiService.post( ROUTES.WORKSPACE.INVITATION_LINK.replace(":workspaceId",workspaceId),{
            emails,
            invitationLink
         })
        
         return response
     } catch (error) {
        const err: string = catchErrorHandle(error, "Failed to send")
    throw new Error(err)
     }

}