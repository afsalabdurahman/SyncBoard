import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectId: null,
  projectName: "All Projects",
  isSwitch: false,
};

const switchProjectSlice = createSlice({
  name: "switchProject",
  initialState,
  reducers: {
    setSwitchProject: (state, action) => {
      state.projectId = action.payload.projectId;
      state.projectName = action.payload.projectName;
      state.isSwitch = action.payload.isSwitch;
    },

    resetSwitchProject: (state) => {
      state.projectId = null;
      state.projectName = "";
      state.isSwitch = false;
    },

    toggleSwitchProject: (state) => {
      state.isSwitch = !state.isSwitch;
    },
    
  },
});

export const {
  setSwitchProject,
  resetSwitchProject,
  toggleSwitchProject,
} = switchProjectSlice.actions;

export default switchProjectSlice.reducer;