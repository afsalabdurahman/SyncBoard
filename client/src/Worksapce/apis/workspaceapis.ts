import apiService from "../../Services/apiServices/apiService"

export const myProjects = async() =>{
   const response = await apiService.get("project/projects")
    console.log(response)
    return response
}
export const sendQuery = async(userName:string,query:string)=>{
    const response = await apiService.post("rag/search",{
        user:userName,
        query:query
    })
    return response
}