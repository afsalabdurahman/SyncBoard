import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Details {
  user_name: string;
  user_email: string;
  user_password: string;
  user_role:string;
  user_imageUrl: string;
  user_about: string;
  user_location: string;
  user_status:string;
  user_address:string;
  user_phone:string;
  user_department:string;
}

const initialState: Details = {
  user_name: "",
  user_email: "",
  user_password: "",
  user_role:"",
 user_about:"",
  user_address:"",
  user_department:"",
  user_imageUrl:"",
  user_location:"",
  user_phone:"",
  user_status:"",

};

const registerSlice = createSlice({
  name: 'registerSlice',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.user_name = action.payload;
    },
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.user_email = action.payload;
    },
    setUserPassword: (state, action: PayloadAction<string>) => {
      state.user_password = action.payload;
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.user_role = action.payload;
    },
    setUserAbout:(state, action: PayloadAction<string>) => {
      state.user_about = action.payload;
    },
     setUserAddress:(state, action: PayloadAction<string>) => {
      state.user_address = action.payload;
    },
     setUserDepartment:(state, action: PayloadAction<string>) => {
      state.user_department = action.payload;
    },
     setUserImageUrl:(state, action: PayloadAction<string>) => {
      state.user_imageUrl = action.payload;
    },
     setUserPhone:(state, action: PayloadAction<string>) => {
      state.user_phone = action.payload;
    },
     setUserLocation:(state, action: PayloadAction<string>) => {
      state.user_location = action.payload;
    },
     setUserStatus:(state, action: PayloadAction<string>) => {
      state.user_status = action.payload;
    },


    resetUser: (state) => {
      state.user_name = "";
      state.user_email = "";
      state.user_password = "";
      state.user_about="";
      state.user_address="";
      state.user_department="";
      state.user_imageUrl="";
      state.user_phone="";
      state.user_status="";
      state.user_location="";

    },

   
  }
});

export const {
  setUserName,
  setUserEmail,
  setUserPassword,
  setUserRole,
  resetUser,
  setUserAbout,
  setUserAddress,
  setUserDepartment,
  setUserImageUrl,
  setUserLocation,
  setUserPhone,
  setUserStatus

} = registerSlice.actions;

export default registerSlice.reducer;
