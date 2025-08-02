import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  imageUrl?: string;
  phone?: string | null;
  location?: string | null;
  status?: string;
  about?: string | null;
  address?: string | null;
  departmant?: string | null;
  workspaces?: any[]; // You can type this better if you know the workspace structure
}

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

const AlluserSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    clearUsers(state) {
      state.users = [];
    },
  },
});

export const { setUsers, addUser, clearUsers } = AlluserSlice.actions;
export default AlluserSlice.reducer;
