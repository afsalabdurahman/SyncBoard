// src/features/logs/logThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";

export const fetchAllLogs = createAsyncThunk(
  "logs/fetchAll",
  async (workspaceId) => {
    const response = await apiService.get("activities/all", {
      workspaceId,
    }); // Replace with real endpoint
    return response.data;
  }
);
