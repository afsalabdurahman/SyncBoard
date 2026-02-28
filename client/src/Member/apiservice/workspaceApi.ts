import apiService from "../../Services/apiServices/apiService"
import { catchErrorHandle } from "../../Utility/catchErrorHandle"

export const createWorkspace = async(email:string,workspaceName:string,slug:string,title:string,role:string,ownerId:string) =>{
    try {
        const response = await apiService.post("workspace/create",{
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
export const sendInvitaionMail = async(email:string|null,invitaionLink:string)=>{
     try {
         const response = await apiService.post(  "workspace/invite",{
            email,
            invitaionLink
         })
         console.log(response,"responseINVITElink")
         return response
     } catch (error) {
        const err: string = catchErrorHandle(error, "Failed to send")
    throw new Error(err)
     }

}