
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const handleApiError = (error: AxiosError): void => {

  const status = error.response?.status;
  const data = error.response?.data as { message?: string; error?: string };
  let message = "Unexpected error occurred. Please try again.";

  if (error.response) {
    switch (status) {
      case 400:
        message = data?.message || "Invalid request data.";
        break;
      case 401:
        message = "Session expired. Please login again.";
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        break;
      case 403:
        message = data?.message || "Access denied.";
        const url: string = error.response?.config?.url || "";
    if (url !== "auth/user/login") {
    window.location.href = "/login";
  }
     
        break;
      case 404:
        console.log(error,"data reved otp")
        message = data?.message || "Requested resource not found.";
        break;
      case 409:
        message = data?.message || "Conflict detected.";
        break;
      case 422:
        message = data?.message || "Validation error.";
        break;
      case 500:
        message = "Server error. Please try again later.";
        break;
      default:
        message = data?.message || `Error ${status}: Something went wrong.`;
    }
  } else if (error.request) {
    message = "Network error. Please check your internet connection.";
  } else {
    message = error.message || "An unknown error occurred.";
  }

  // toast.error(message);
  console.error(`[API Error] ${message}`, error);
};
