import { Middleware, UnknownAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const errorMiddleware: Middleware =
  () => (next) => (action: UnknownAction) => {

    const result = next(action);

    if (action.type.endsWith("/rejected")) {

      const errorAction = action as {
        payload?: string;
        error?: { message?: string };
      };

      const message =
        errorAction.payload ??
        errorAction.error?.message ??
        "Something went wrong. Please try again.";

      toast.error(message);
    }

    return result;
  };
