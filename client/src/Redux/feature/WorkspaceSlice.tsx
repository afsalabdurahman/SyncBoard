import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* Member Interface */
export interface Member {
  userId: string;
  title: string;
}

/* Workspace Types */
export type WorkspaceStatus = "active" | "inactive" | "suspend" | "deleted";

export type WorkspaceStorage = 1 | 5 | 10 | 100;

/* Workspace Interface */
export interface Workspace {
  name: string;
  slug: string;
  role?: string;
  ownerId?: string;
  members?: Member[];
  status?: WorkspaceStatus;
  storage?: WorkspaceStorage;
  createdAt?: Date;
  _id?: string;
}

/* Redux State */
interface WorkspaceState {
  workspace: Workspace | null;
}

/* Initial State */
const initialState: WorkspaceState = {
  workspace: null,
};

/* Slice */
const workspaceSlice = createSlice({
  name: "workspaceSlice",
  initialState,
  reducers: {
    setWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.workspace = action.payload;
    },
  },
});

export const { setWorkspace } = workspaceSlice.actions;

export default workspaceSlice.reducer;