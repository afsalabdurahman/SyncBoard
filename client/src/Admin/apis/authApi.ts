import apiService from "../../Services/apiServices/apiService";
import { AdminLoginResponse } from "../types/adminTypes";



export const adminLogin = async (
  email: string,
  password: string
): Promise<AdminLoginResponse> => {
  try {
    const { data } = await apiService.post<AdminLoginResponse>(
      "auth/admin/login",
      { email, password },
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
      "auth/admin/google",
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