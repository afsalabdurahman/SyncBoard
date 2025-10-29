import apiService from "../../Services/apiServices/apiService";


export const superLoginApi = async(email:string,password:string)=>{
const response = await apiService.post("auth/super/login",{
    email,
    password},
      { withCredentials: true }
)
if(response.status == 200){
    console.log(response,"rsponse")
return response.data
}
}
export const dashBordDataApi = async()=>{
    const response = await apiService.get("super/counts")
    console.log(response,"api rseponse")
    if(response.status == 200) return response.data.data
}

