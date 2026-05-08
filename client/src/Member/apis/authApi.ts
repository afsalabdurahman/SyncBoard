import { AxiosError, AxiosResponse } from "axios";
import apiService from "../../Services/apiServices/apiService";
import { commentType, SignupResponse } from "../types/authType"
import { catchErrorHandle } from "../../Utility/catchErrorHandle";
import { AdminLoginResponse, User, Workspace } from "../../Admin/types/adminTypes";
import { ROUTES } from "../../Constants/routeConstan";
interface ErrorResponse {
  message: string;
}


export const signupApi = async (email: string, name: string, password: string): Promise<SignupResponse | null> => {
  try {
    const response: AxiosResponse<SignupResponse | null> = await apiService.post(
      ROUTES.MEMBER.REGISTER_USER,
      { email, name, password }
    );

    if (response.status == 200) {
      return response.data
    }


  } catch (err: unknown) {


    let errorMessage = "Something went wrong";

    if (err && typeof err === "object" && "isAxiosError" in err) {
      const axiosError = err as AxiosError<ErrorResponse>;

      errorMessage = axiosError.response?.data?.message || axiosError.message;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
  return null;
}


export const loginApi = async (email: string, password: string): Promise<{ workspace: Workspace, user: User } | null> => {
  try {
    const response: AxiosResponse<AdminLoginResponse> = await apiService.post(
      ROUTES.PUBLIC.LOGIN,
      { email, password },

    );

    if (response.status === 200) {
      return {
        workspace: response.data.workspace,
        user: response.data.user,
      };

    }
  } catch (err: unknown) {


    if (err.status == 403 && err.response.data.message == "Create a new workspace") {

      const data = JSON.stringify(err.response.data.data)
      throw new Error(data);
    } else {



      let errorMessage = "Failed to login";

      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ErrorResponse>;

        errorMessage = axiosError.response?.data?.message || axiosError.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      throw new Error(errorMessage);
    }
  }
  return null;
};
export const sendComment = async (
  taskId: string,
  name: string,
  text: string,
  urls: string[] = [] // default to empty array
): Promise<boolean> => {
  try {

    const response = await apiService.post(ROUTES.WORKSPACE.SEND_COMMENT.replace(':taskId', taskId), {
      name,
      text,
      urls, // better name: plural
    });

    // Common success codes: 200 or 201
    if (response.status === 200 || response.status === 201) {
      return true;
    }

    // If status is not success, treat as failure
    return false;
  } catch {


    return false; // or throw error if you prefer
  }

};
export const fetchComments = async (taskId: string): Promise<commentType[]> => {
  const response = await apiService.get(ROUTES.WORKSPACE.FETCH_COMMENT.replace(':taskId', taskId));

  return response.data.data as commentType[];
};
export const verifyOTP = async (
  email: string,
  otp: string
) => {
  try {
    const response: AxiosResponse = await apiService.post(
      ROUTES.MEMBER.VERIFY_OTP,
      {
        email,
        otp,
      }
    );


    return response.data.user


  } catch {
    throw new Error("Invalid OTP");
  }
};

export const findEmail = async (email: string) => {
  try {
    const response = await apiService.get(ROUTES.MEMBER.FIND_EMAIL.replace(':email', email));
    return response.data.user
  } catch (error) {
    const err: string = catchErrorHandle(error, "User not found")
    throw new Error(err)
  }
}
export const reSendOTP = async (email: string) => {
  try {
    await apiService.post(ROUTES.MEMBER.RESEND_OTP, { email: email })
  } catch (error) {
    const err: string = catchErrorHandle(error, "Failed to send OTP")
    throw new Error(err)
  }
}
export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  try {
    await apiService.patch(ROUTES.MEMBER.CHANGE_PASSWORD.replace(':userId', userId),
      { currentPassword, newPassword }
    )
    return true
  } catch (error) {
    const err: string = catchErrorHandle(error, "Failed to change password")
    throw new Error(err)
  }
}
export const registerUser = async (name: string, email: string, password: string,) => {
  try {
    const response = await apiService.post(ROUTES.MEMBER.REGISTER_USER, {
      email,
      password,
      name,
      role: "Admin"
    })
    return response.data.user

  } catch (error) {
    const err: string = catchErrorHandle(error, "Failed to send OTP")
    throw new Error(err)
  }


}
export const resetPassword = (userId: string, password: string) => {
  try {
    apiService.post(ROUTES.MEMBER.RESET_PASSWORD.replace(':userId', userId), {
      password
    })
  } catch (error) {
    const err: string = catchErrorHandle(error, "Failed to send OTP")
    throw new Error(err)
  }
}
export const googleAuth = async (credentialResponse: { credential: string }) => {
  try {
    const response = await apiService.post(ROUTES.PUBLIC.GOOGLE_AUTH, { credential: credentialResponse.credential, })
    return response

  } catch (error) {
    catchErrorHandle(error, "Failed to signup")
  }
}
