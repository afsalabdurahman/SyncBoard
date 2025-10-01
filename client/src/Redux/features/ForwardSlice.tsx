import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

const forwardSlice = createSlice({
  name: "forward",
  initialState,
  reducers: {
    setForward: (state, action: PayloadAction<boolean>) => {
      return action.payload; // return new boolean value
    },
    toggleForward: (state) => {
      return !state; // flip true/false
    },
  },
});

export const { setForward, toggleForward } = forwardSlice.actions;
export default forwardSlice.reducer;
