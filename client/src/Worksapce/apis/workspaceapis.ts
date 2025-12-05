import apiService from "../../Services/apiServices/apiService"

export const myProjects = async () => {
    const response = await apiService.get("project/projects")
    console.log(response)
    return response
}
export const sendQuery = async (userName: string, query: string) => {
    const response = await apiService.post("rag/search", {
        user: userName,
        query: query
    })
    return response
}
export const sendAbuse = async (formData:any,userId,workspaceId)=>{
    const response = await apiService.post(`workspace/abuse/${userId}/${workspaceId}`,{
        description:formData.description,
        type:formData.type,
        severity:formData.severity
    })
    console.log(response,"api")
    return response.status
}
export const logout = async (userId:string) =>{
    console.log("logout...",userId)
     const response=await apiService.patch(`/auth/logout/${userId}`)
console.log(response,"reponse")
return response.status
   
}
export const  myLogs = async (workspaceId:string) =>{
    console.log(workspaceId,"ID++")
    const response = await apiService.get(`/activities/logs/${workspaceId}`)
    console.log(response,"response+++")
    return response.data
   
}