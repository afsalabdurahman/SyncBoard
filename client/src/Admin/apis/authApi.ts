import { ROUTES } from "../../Constants/routeConstan";
import apiService from "../../Services/apiServices/apiService";
import { AdminLoginResponse } from "../types/adminTypes";



export const adminLogin = async (
  email: string,
  password: string,
  workspaceId:string,
): Promise<AdminLoginResponse> => {
  try {
    const { data } = await apiService.post<AdminLoginResponse>(
      ROUTES.PUBLIC.ADMIN_LOGIN,
      { email, password,workspaceId },
      { withCredentials: true }
    );
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Admin login failed");
  }
};
export const googleAdminAuth = async (credential: string,
): Promise<AdminLoginResponse> => {
  try {
    const { data } = await apiService.post<AdminLoginResponse>(
      ROUTES.PUBLIC.GOOGLE_ADMIN_AUTH,
     {credential}
    );
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Admin login failed");
  }
};