import { Action } from "@radix-ui/react-alert-dialog";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCountData } from "../thunks/countThunks";
export interface SubscriptionChange {
  nameOfWorkspace: string;
  subscriptionPlan: string;
  amount: number;
  date: string;
}

export interface Count {
  userCount: number;
  workspaceCount: number;
  subscriptionCount: number;
  subscriptionChanges: SubscriptionChange[];
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;

}

const initialState: Count = {
  userCount: 0,
  workspaceCount: 0,
  subscriptionCount: 0,
  subscriptionChanges: [],
  status: "idle"
};


const countSlice = createSlice({
  name: "Count",
  initialState,
  reducers: {
    setCounts(state, action: PayloadAction<Count>) {
      state.userCount = action.payload.userCount;
      state.workspaceCount = action.payload.workspaceCount;
      state.subscriptionCount = action.payload.subscriptionCount;
      state.subscriptionChanges = action.payload.subscriptionChanges;
    },
    countClear(state) {
      state.subscriptionCount = 0;
      state.userCount = 0;
      state.workspaceCount = 0;
      state.subscriptionChanges.length = 0;

    }
  },
extraReducers: (builder) => {
  builder
    .addCase(fetchCountData.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(fetchCountData.fulfilled, (state, action: PayloadAction<Count>) => {
      console.log("Fetched payload:", action.payload);

      const data = action.payload || {};

      state.userCount = data.userCount ?? 0;
      state.workspaceCount = data.workspaceCount ?? 0;
      state.subscriptionCount = data.subscriptionCount ?? 0;
      state.subscriptionChanges = data.subscriptionChanges ?? [];
      state.status = "succeeded";
    })
    .addCase(fetchCountData.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error?.message || "Failed to fetch count data";
    });
}

})

export const {
  countClear,
  setCounts
} = countSlice.actions;
export default countSlice.reducer;