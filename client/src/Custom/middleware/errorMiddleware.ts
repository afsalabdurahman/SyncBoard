
import { Middleware } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const errorMiddleware: Middleware = () => (next) => (action) => {
  
  const result = next(action);


  if (action.type.endsWith("/rejected")) {

    const message =
      action.payload ||
      action.error?.message ||
      "Something went wrong. Please try again.";

    toast.dismiss(); 
    toast.error(message);
  }

  return result;
};
