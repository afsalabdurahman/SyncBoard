import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from "../../../Admin/types/userTypes"
import { fetchAllUsers, removeUser, updateUser } from './AlluserThunks';
import { taskResponse } from '../../../Admin/types/taskTypes';


interface UserState {
  users: User[];
  loading: boolean;
  error?: string | null;
  page: number;
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  rowPerPage: number
  totalItems: number
  totalPage: number

}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  status: "idle",
  page: 1,
  rowPerPage: 5,
  totalItems: 0,
  totalPage: 0
};

const AlluserSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserPage: (state, action) => {
      state.page = action.payload;
    },


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
  extraReducers: (builder) => {
    builder
      // FETCH ALL USERS
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<taskResponse>) => {

        state.users = [...action.payload.items];
        state.totalItems = action.payload.totalItems;
        state.page = Number(action.payload.currentPage);
        state.totalPage = action.payload.totalPages;

        state.status = 'succeeded';
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        state.status = 'succeeded';
      })

      // SOFT DELETE USER
      .addCase(removeUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
  

        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      });
  }

});


export const { setUsers, addUser, clearUsers, setUserPage } = AlluserSlice.actions;
export default AlluserSlice.reducer;
