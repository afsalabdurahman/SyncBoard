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
        toast.error(message);
        break;

      case 401:
        // DO NOT dispatch logout or toast here.
        // The axios interceptor already handles 401:
        //   - It attempts a token refresh
        //   - On failure it fires "auth:session-expired"
        //   - AuthProvider listens and dispatches logoutUserAuth() + navigates
        // Adding logout here causes a double dispatch + race condition.
        break;

      case 403: {
        const msg = data?.message || "Access denied.";
        const isLoggedIn = store.getState().auth?.user;

        if (isLoggedIn) {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("blocked")) {
            toast.error("Your account has been blocked.");
          } else if (lowerMsg.includes("removed")) {
            toast.error("Your account has been removed.");
          } else if (lowerMsg.includes("suspended")) {
            toast.error("Workspace is suspended.");
          }
          store.dispatch(logoutUserAuth());
        }
        break;
      }

      case 404:
        message = data?.message || "Requested resource not found.";
        toast.error(message);
        break;

      case 409:
        message = data?.message || "Conflict detected.";
        toast.error(message);
        break;

      case 422:
        message = data?.message || "Validation error.";
        toast.error(message);
        break;

      case 500:
        message = "Server error. Please try again later.";
        toast.error(message);
        break;

      default:
        message = data?.message || `Error ${status}: Something went wrong.`;
        toast.error(message);
    }
  } else if (error.request) {
    toast.error("Network error. Please check your internet connection.");
  } else {
    toast.error(error.message || "An unknown error occurred.");
  }

  console.error(`[API Error] Status ${status}`, error);
};