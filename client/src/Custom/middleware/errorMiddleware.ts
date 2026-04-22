import { Middleware, isRejectedWithValue } from "@reduxjs/toolkit";
import { catchErrorHandle } from "../../Utility/catchErrorHandle";

export const errorMiddleware: Middleware =
  () => (next) => (action) => {
    const result = next(action);

    // Safe way using RTK helper
    if (isRejectedWithValue(action)) {
      const message =
        typeof action.payload === "string"
          ? action.payload
          : action.error?.message || "Something went wrong";

      // toast.error(message);
      catchErrorHandle(message,"something went to wrong")
    }

    return result;
  };