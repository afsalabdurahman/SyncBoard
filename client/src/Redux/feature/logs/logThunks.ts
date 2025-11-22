// src/features/logs/logThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../Services/apiServices/apiService";

export const fetchAllLogs = createAsyncThunk(
  "logs/fetchAll",
  async (workspaceId) => {
    const response = await apiService.get("activities/all", {
      workspaceId,
    });
    return response.data;
  }
);
