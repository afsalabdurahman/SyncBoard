import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  name?: string;
  email?: string;
  password?: string;
  role?:string;
  superAdmin?:boolean;
  isAdmin?:boolean;
  title?:string;
  imageUrl?: string;
  about?: string;
  location?: string;
  status?:string;
  address?:string;
  phone?:string;
  department?:string;

}

interface UserState {
  password: any;
  name: any;
  email: any;
  user: User|null;
}


const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    clearUserData: (state) => {
      state.user = null;
    },
      updateUserPartial: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
   
  }
});

export const {
  setUserData,
  clearUserData,
  updateUserPartial

} = userSlice.actions;

export default userSlice.reducer;
