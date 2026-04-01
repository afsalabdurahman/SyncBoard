import { handleApiError } from "../../Services/apiServices/apiErrorHandle";
import api from "../../Services/apiServices/apiService";
import { catchErrorHandle } from "../../Utility/catchErrorHandle";

export const updateUser = async (userId: string, updatedProfile: any) => {
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

    return axiosResponse.data;   // ← Always return data on success (good practice)
  } catch (error: any) {
    const errorMessage = catchErrorHandle(error, "Updation failed");
    
    // Better: Throw a proper error object so toast can read it easily
    const customError = new Error(errorMessage);
    (customError as any).response = error?.response;   // Preserve axios response if needed
    
    throw customError;
  }
};