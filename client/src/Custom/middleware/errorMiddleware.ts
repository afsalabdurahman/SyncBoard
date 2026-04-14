import { Middleware, UnknownAction } from "@reduxjs/toolkit";

export const errorMiddleware: Middleware =
  () => (next) => (action: UnknownAction) => {

    const result = next(action);

    if (action.type.endsWith("/rejected")) {

      const errorAction = action as {
        payload?: string;
        error?: { message?: string };
      };

  

      // toast.error(message);
    }

    return result;
  };
