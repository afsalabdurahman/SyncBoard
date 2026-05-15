import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id?:string;
  name?: string;
  email?: string;
 password?:string;
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

  name?: string;
  email?: string;
  user?: User|null;
  permissions?:string;
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
     updatePermission:(state,action:PayloadAction<string>)=>{
        state.permissions=action.payload
      }
   
  }
});

export const {
  setUserData,
  clearUserData,
  updateUserPartial,
  updatePermission

} = userSlice.actions;

export default userSlice.reducer;
