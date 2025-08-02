// features/logSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Define a type for the log item
interface LogItem {
  id: string;
  message: string;
  timestamp?: string;
}

// Define the slice state
interface LogsState {
  logArray: LogItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: LogsState = {
  logArray: [],
  status: 'idle',
  error: null,
};

// 🔁 Thunk to fetch logs from API
export const fetchLogs = createAsyncThunk('logs/fetchLogs', async () => {
  const response = await apiService.get<LogItem[]>('/all-logs'); // Adjust endpoint
  return response.data;
});

const logSlice = createSlice({
  name: 'logSlice',
  initialState,
  reducers: {
    // Manual log add
    setLog: (state, action: PayloadAction<LogItem>) => {
      state.logArray.push(action.payload);
    },
    // Optional: clear logs
    clearLogs: state => {
      state.logArray = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLogs.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchLogs.fulfilled, (state, action: PayloadAction<LogItem[]>) => {
        state.status = 'succeeded';
        state.logArray = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch logs';
      });
  },
});

// Export actions and reducer
export const { setLog, clearLogs } = logSlice.actions;
export default logSlice.reducer;
