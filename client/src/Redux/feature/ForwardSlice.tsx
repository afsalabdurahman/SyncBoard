import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ForwardState {
  isForward: boolean;
  title: string;
}

const initialState: ForwardState = {
  isForward: false,
  title: "",
};

const forwardSlice = createSlice({
  name: "forward",
  initialState,
  reducers: {
    setForward: (state, action: PayloadAction<boolean>) => {
      state.isForward = action.payload;
    },

    toggleForward: (state) => {
      state.isForward = !state.isForward;
    },

    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export const { setForward, toggleForward, setTitle } =
  forwardSlice.actions;

export default forwardSlice.reducer;