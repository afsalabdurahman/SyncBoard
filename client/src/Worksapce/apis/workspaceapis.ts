import apiService from "../../Services/apiServices/apiService"

export const myProjects = async (workspaceId:string) => {
    const response = await apiService.get(`project/projects/${workspaceId}`)
    console.log(response,"projectAPICLLLEDD")
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

export const searchApi = (searchQuery,workspaceid,userid) =>{
    try {
       const response= apiService.get(`workspace/abuse/report/search/${workspaceid}/${userid}?q=${encodeURIComponent(searchQuery)}`);
       return response
    } catch (error) {
        console.log(error)
    }
}
export const abuseReportList = async (userId:string,workspaceId:string,page:number)=>{
    const response = await apiService.get(`workspace/abuse/list/${workspaceId}/${userId}?page=${page}&&limit=5`);
    console.log(response,"response+++PAi")
    return response
}

export const getMyAbuseReports = ()=>{
    console.log("sefs")
    return {data:"fseifhils"}
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
export const acceptInvitaionLink = async( name,
          email,
          password,
          role,
          title,
          workspaceSlug,)=>{
            const response= await apiService.post( "member/invite/register",{
                name,email,password,role,title,workspaceSlug
            })
            return response
          }

          export const paginationUser = async(slug:string,page:number)=>{
            const response = await apiService.get(`workspace/member/pagination/data/${slug}?page=${page}&limit=5`);
            console.log(response,"responseAPI,")
            return response.data
          }

           
          export const allMembers = async (slug:string)=>{
         const response = await apiService.get(`workspace/member/data/${slug}`) 
         console.log(response,"APi Fetch alldataUser")
         return response.data
          }
          export  const searchUser = async (slug:string,q:string)=>{
           try {
            const response=await apiService.get(`workspace/members/find/${slug}?query=${q}`);
            console.log(response,"respse SErach")
            return response.data
           } catch (error) {
            console.log(error)
           }
          }