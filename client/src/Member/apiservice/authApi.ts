import axios, { AxiosError, AxiosResponse } from "axios";
// import apiService from "../../Services/apiServices/apiService";
import apiService from "../../Services/apiServices/apiService";
import { commentType, SignupResponse } from "../types/authType"
import { ToastContainer, toast } from "react-toastify";
import { error } from "console";
import { catchErrorHandle } from "../../Utility/catchErrorHandle";

export const signupApi = async (email: string, name: string, password: string): Promise<SignupResponse | null | boolean> => {
  try {
    const response: AxiosResponse<SignupResponse | null> = await apiService.post(
      "auth/user/sendotp",
      { email, name, password }
    );
    console.log(response, "response")
    if (response.status == 200) {
      return response.data
    }


  } catch (err: unknown) {

    console.log(err, "chechERr")

    let errorMessage = "Something went wrong";

    if (err && typeof err === "object" && "isAxiosError" in err) {
      const axiosError = err as AxiosError<any>;
      console.log(axiosError, "eros axios")
      errorMessage = axiosError.response?.data?.message || axiosError.message;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
}


export const loginApi = async (email: string, password: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await apiService.post(
      "auth/user/login",
      { email, password },
      { withCredentials: true }
    );
console.log(response,"api++")
    if (response.status === 200) {
      return {
        workspace: response.data.workspace,
        user: response.data.user,
      };

    }
  } catch (err: unknown) {

    console.log(err, "chechERr")
    if(err.status == 403 && err.response.data.message == "Create a new workspace"){
      
      const data=JSON.stringify(err.response.data.data)
       throw new Error(data);
    }else{

    

    let errorMessage = "Failed to login";

    if (err && typeof err === "object" && "isAxiosError" in err) {
      const axiosError = err as AxiosError<any>;
      console.log(axiosError, "eros axios")
      errorMessage = axiosError.response?.data?.message || axiosError.message;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }}
};
export const sendComment = async (
  taskId: string,
  name: string,
  text: string,
  urls: string[] = [] // default to empty array
): Promise<boolean> => {
  try {
    console.log(urls, taskId, name, "in api+++")
    const response = await apiService.post(`/task/send/comment/${taskId}`, {
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
  } catch (error) {

    console.error('Failed to send comment:', error);
    return false; // or throw error if you prefer
  }

};
export const fetchComments = async (taskId: string): Promise<commentType[]> => {
  const response = await apiService.get(`/task/comments/${taskId}`);
  console.log(response, "respeApii");
  return response.data.data as commentType[];
};
export const verifyOTP = async (
  email: string,
  otp: string
): Promise<boolean | void> => {
  try {
    const response: AxiosResponse = await apiService.post(
      "auth/user/verifyotp",
      {
        email,
        otp,
      }
    );
    if (response.status === 201) {
      return true;
    }

  } catch (error: unknown) {
    throw new Error("Invalid OTP");
  }
};

export const findEmail = async (email: string) => {
  try {
    const response = await apiService.get(`/member/find/user/${email}`);
    return response.data.user
  } catch (error) {
    const err: string = catchErrorHandle(error, "User not found")
    throw new Error(err)
  }
}
export const reSendOTP = async (email: string) => {
  try {
    await apiService.post("/auth/user/forgot/password", { email: email })
  } catch (error) {
    const err: string = catchErrorHandle(error, "Failed to send OTP")
    throw new Error(err)
  }
}
export const changePassword = async (userId,currentPassword,newPassword) =>{
  try {
    await apiService.patch( `member/change/password/${userId}`,
       { currentPassword, newPassword }
    )
    return true
  } catch (error) {
    const err: string = catchErrorHandle(error, "Failed to change password")
    throw new Error(err)
  }
}

