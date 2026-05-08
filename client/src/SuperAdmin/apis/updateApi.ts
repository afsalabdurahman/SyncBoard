import { User } from "../../Admin/types/userTypes";
import { ROUTES } from "../../Constants/routeConstan";
import api from "../../Services/apiServices/apiService";
import { catchErrorHandle } from "../../Utility/catchErrorHandle";

export const updateUser = async (userId: string, updatedProfile: User) => {
  try {
    if (!updatedProfile.about) {
      delete updatedProfile.about;
    }

    const axiosResponse = await api.patch(
      ROUTES.SUPER_ADMIN.UPDATE_USER.replace(":userId",userId),
      {
        profileData: updatedProfile,
      },
      { withCredentials: true }
    );

    return axiosResponse.data;   
  } catch (error) {
    const errorMessage = catchErrorHandle(error, "Updation failed");
    
    throw errorMessage;
  }
};