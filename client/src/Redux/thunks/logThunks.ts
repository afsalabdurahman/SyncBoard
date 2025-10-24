// src/features/logs/logThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../Services/api";

export const fetchAllLogs = createAsyncThunk(
  "logs/fetchAll",
  async (workspaceId) => {
    const response = await apiService.get("activities/all", {
      workspaceId,
    });
    return response.data;
  }
);
