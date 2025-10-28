import apiService from "../../Services/apiServices/apiService"

export const myProjects = async() =>{
   const response = await apiService.get("project/projects")
    console.log(response)
    return response
}