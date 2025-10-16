import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";
import { Count } from "../superadmin/countSlice"


export const fetchCountData = createAsyncThunk('/superCountData/fetchCounts', async (email: string, pwd) => {
  const response = await apiService.get("super/login", {
    email,
    pwd
  });
  return response.data;
})