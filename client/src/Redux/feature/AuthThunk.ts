import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../Services/apiServices/apiService";

export const logoutUserAuth = createAsyncThunk<
  boolean,
  string | undefined,
  { rejectValue: string }
>(
  "auth/logout",
  async (userId, { rejectWithValue }) => {
    try {
      if (userId) {
        await apiService.post(`/auth/logout/${userId}`);
      }

      return true;
    } catch (error: any) {
      console.warn(
        "Logout API failed, but clearing local state anyway",
        error
      );

      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);