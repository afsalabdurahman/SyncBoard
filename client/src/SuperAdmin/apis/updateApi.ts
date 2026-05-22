import { User } from "../../Admin/types/userTypes";
import api from "../../Services/apiServices/apiService";
import { catchErrorHandle } from "../../Utility/catchErrorHandle";

export const updateUser = async (userId: string, updatedProfile: User) => {
  try {
    if (!updatedProfile.about) {
      delete updatedProfile.about;
    }

    const axiosResponse = await api.patch(
      `member/profile/update/${userId}`,
      {
        profileData: updatedProfile,
      },
      { withCredentials: true }
    );

    return axiosResponse.data;   
  } catch (error) {
    const errorMessage = catchErrorHandle(error, "Updation failed");
    
    
    const customError = new Error(errorMessage);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (customError as any).response = error?.response;   
    
    throw customError;
  }
};