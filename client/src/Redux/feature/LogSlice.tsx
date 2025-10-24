import { fetchAllLogs } from "../thunks/logThunks";
import { createSlice } from "@reduxjs/toolkit";
export interface LogItem {
  messages: string;
}

export interface LogState {
  workspaceLogs: LogItem[];
  projectActivityLogs: LogItem[];
  userActivityLogs: LogItem[];
  loading: boolean;
  error: string | null;
}

const initialState: LogState = {
  workspaceLogs: [],
  projectActivityLogs: [],
  userActivityLogs: [],
  loading: false,
  error: null,
};

const logSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLogs.fulfilled, (state, action) => {
      
        state.workspaceLogs = action.payload.workspaceLogs.filter(
          (log: LogItem) => log.messages
        );
        state.projectActivityLogs = action.payload.projectActivtyLogs.filter(
          (log: LogItem) => log.messages
        );
        state.userActivityLogs = action.payload.userActivityLogs.filter(
          (log: LogItem) => log.messages
        );
        state.loading = false;
      })
      .addCase(fetchAllLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch logs";
      });
  },
});

export default logSlice.reducer;
