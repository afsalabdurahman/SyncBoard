import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../Services/apiServices/apiService";
import { ROUTES } from "../../../Constants/routeConstan";



export const fetchCountData = createAsyncThunk('/superCountData/fetchCounts', async (email: string, pwd) => {
  const response = await apiService.get(ROUTES.PUBLIC.SUPER_AUTH, {
    email,
    pwd
  });
  return response.data;
})