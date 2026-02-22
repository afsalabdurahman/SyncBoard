
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { store } from "../../Redux/store";
import { logoutUserAuth } from "../../Redux/feature/AuthSlice";

export const handleApiError = (error: AxiosError): void => {

  const status = error.response?.status;
  const data = error.response?.data as { message?: string; error?: string };
  let message = "Unexpected error occurred. Please try again.";

  if (error.response) {
    switch (status) {
      case 400:
        message = data?.message || "Invalid request data.";
        break;
     case 401: {

 

  const url = error?.config?.url || "";
  const protectedRoutes = ["projects", "activities", "invitation", "workspace"];

  const isProtectedRequest = protectedRoutes.some(route =>
    url.includes(route)
  );

  const isUserLoggedIn = store.getState().auth?.user; // adjust based on your state

  if (isProtectedRequest && isUserLoggedIn) {
    toast.error("Session expired. Please login again.");
  }

  store.dispatch(logoutUserAuth());
  break;
}


     case 403: {
  const message = data?.message || "Access denied.";
  console.log(message, "403 message");

  const isUserLoggedIn = store.getState().auth?.user;

  if (isUserLoggedIn && message?.toLowerCase().includes("blocked")) {
    toast.error("Your account has been blocked.");
    store.dispatch(logoutUserAuth());
  }else if(isUserLoggedIn && message?.toLowerCase().includes("removed")){
 toast.error("Your account has been removed.");
    store.dispatch(logoutUserAuth());
  }else if(isUserLoggedIn && message?.toLowerCase().includes("Suspended")){
    toast.error("Workspace is suspended")
    store.dispatch(logoutUserAuth());
  }
  
  else{
    store.dispatch(logoutUserAuth());
  }

  break;
}

      case 404:
        console.log(error, "data reved otp")
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
