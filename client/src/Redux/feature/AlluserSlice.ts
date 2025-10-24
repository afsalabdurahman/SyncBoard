import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {User} from "../../Admin/types/userTypes"


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
