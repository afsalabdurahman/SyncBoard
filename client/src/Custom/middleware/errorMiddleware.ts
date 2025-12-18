
import { Middleware } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const errorMiddleware: Middleware = () => (next) => (action) => {

  const result = next(action);

  console.log("calling.... midle", action, result)
  if (action.type.endsWith("/rejected")) {

    console.log("calling.... midle", result)
    const message =
      action.payload ||
      action.error?.message ||
      "Something went wrong. Please try again.";

    // toast.dismiss(); 
    // toast.error(message);
  }

  return result;
};
