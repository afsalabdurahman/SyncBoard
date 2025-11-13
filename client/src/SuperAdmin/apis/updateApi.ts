import api from "../../Services/apiServices/apiService";
export const  updateUser =async (userId,updatedProfile)=>{
    console.log(userId,updatedProfile,"apicall")
      const axiosResponse: AxiosResponse<any> = await api.patch(
           `member/profile/update/${userId}`,
           {
             profileData: updatedProfile,
           },
           { withCredentials: true }
         );
}
