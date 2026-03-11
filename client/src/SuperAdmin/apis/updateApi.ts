import api from "../../Services/apiServices/apiService";
export const  updateUser =async (userId,updatedProfile)=>{
   
      const axiosResponse = await api.patch(
           `member/profile/update/${userId}`,
           {
             profileData: updatedProfile,
           },
           { withCredentials: true }
         );
}
