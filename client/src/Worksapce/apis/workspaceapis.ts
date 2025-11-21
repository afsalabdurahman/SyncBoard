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
export const sendAbuse = async (formData:any,userId)=>{
    const response = await apiService.post(`workspace/abuse/${userId}`,{
        description:formData.description,
        type:formData.type,
        severity:formData.severity
    })
    return response.status
}