import axios, { AxiosError, AxiosResponse } from "axios";
// import apiService from "../../Services/apiServices/apiService";
import apiService from "../../Services/apiServices/apiService";
import { commentType, SignupResponse } from "../types/authType"
import { ToastContainer, toast } from "react-toastify";
import { error } from "console";

export const signupApi = async (email: string, name: string, password: string): Promise<SignupResponse | null> => {
  try {
    const response: AxiosResponse<SignupResponse | null> = await apiService.post(
      "auth/user/sendotp",
      { email, name, password }
    );
    console.log(response, "response222222")
    if (response.status !== 200) {
      throw new Error(response)
    }
    else {
      return response.data
    }



  } catch (error) {

    throw new Error(error)

  }
}


export const loginApi = async (email: string, password: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await apiService.post(
      "auth/user/login",
      { email, password },
      { withCredentials: true }
    );

    if (response.status === 200) {
      return {
        workspace: response.data.workspace,
        user: response.data.user,
      };
    } else if (response.status === 422) {
      throw new Error("Password mismatch");
    } else {
      throw new Error("Unexpected error occurred");
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
};
export const sendComment = async (
  taskId: string,
  name: string,
  text: string,
  urls: string[] = [] // default to empty array
): Promise<boolean> => {
  try {
    console.log(urls,taskId,name,"in api+++")
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

