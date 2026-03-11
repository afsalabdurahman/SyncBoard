import  { AxiosError, AxiosResponse } from "axios";
import apiService from "../../Services/apiServices/apiService";
import { commentType, SignupResponse } from "../types/authType"
import { catchErrorHandle } from "../../Utility/catchErrorHandle";
import { AdminLoginResponse, User, Workspace } from "../../Admin/types/adminTypes";

interface ErrorResponse {
  message: string;
}


export const signupApi = async (email: string, name: string, password: string): Promise<SignupResponse | null > => {
  try {
    const response: AxiosResponse<SignupResponse | null> = await apiService.post(
      "auth/user/sendotp",
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
}


export const loginApi = async (email: string, password: string): Promise<{workspace:Workspace,user:User}|null> => {
  try {
    const response: AxiosResponse<AdminLoginResponse> = await apiService.post(
      "auth/user/login",
      { email, password },
   
    );

    if (response.status === 200) {
      return {
        workspace: response.data.workspace,
        user: response.data.user,
      };

    }
  } catch (err: unknown) {


    if(err.status == 403 && err.response.data.message == "Create a new workspace"){
      
      const data=JSON.stringify(err.response.data.data)
       throw new Error(data);
    }else{

    

    let errorMessage = "Failed to login";

    if (err && typeof err === "object" && "isAxiosError" in err) {
      const axiosError = err as AxiosError<ErrorResponse>;
    
      errorMessage = axiosError.response?.data?.message || axiosError.message;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }}
  return null;
};
export const sendComment = async (
  taskId: string,
  name: string,
  text: string,
  urls: string[] = [] // default to empty array
): Promise<boolean> => {
  try {
   
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

   
    return false; // or throw error if you prefer
  }

};
export const fetchComments = async (taskId: string): Promise<commentType[]> => {
  const response = await apiService.get(`/task/comments/${taskId}`);

  return response.data.data as commentType[];
};
export const verifyOTP = async (
  email: string,
  otp: string
)=> {
  try {
    const response: AxiosResponse = await apiService.post(
      "auth/user/verifyotp",
      {
        email,
        otp,
      }
    );

    
     return  response.data.user
    

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
export const registerUser = async (name:string,email:string,password:string,)=>{
  try{
    const response = await apiService.post("/auth/user/register",{
         email,
          password,
          name,
          role:"Admin"
        })
    return response.data.user
    
  }catch(error){
 const err: string = catchErrorHandle(error, "Failed to send OTP")
    throw new Error(err)
  }


}
export const resetPassword  = (userId:string,password:string)=>{
  try {
    apiService.post(`/member/reset/password/${userId}`,{
      password
    })
  } catch (error) {
     const err: string = catchErrorHandle(error, "Failed to send OTP")
    throw new Error(err)
  }
}
