import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserAuth: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutUserAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserAuth, logoutUserAuth } = authSlice.actions;
export default authSlice.reducer;
