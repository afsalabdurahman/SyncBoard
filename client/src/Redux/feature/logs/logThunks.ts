// src/features/logs/logThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../Services/apiServices/apiService";
import { ROUTES } from "../../../Constants/routeConstan";

export const fetchAllLogs = createAsyncThunk(
  "logs/fetchAll",
  async (workspaceId) => {
    const response = await apiService.get(ROUTES.WORKSPACE.ACTIVITIES, {
      workspaceId,
    });
    return response.data;
  }
);
