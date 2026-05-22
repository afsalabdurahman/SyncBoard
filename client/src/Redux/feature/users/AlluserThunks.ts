import { User } from "../../../Admin/types/userTypes";
import apiService from "../../../Services/apiServices/apiService";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { catchErrorHandle } from "../../../Utility/catchErrorHandle";

export const fetchAllUsers = createAsyncThunk('/adminUserData/fetchusers', async ({ page, limit, workspaceslug }: { page: number, limit: number, workspaceslug: string }, { rejectWithValue }) => {
  try {

    const response = await apiService.get(`workspace/member/pagination/data/${workspaceslug}?page=${page}&limit=${limit}`);
    if (response.status == 200) {

      return response.data;
    } else {
      return rejectWithValue("something went to wrong")
    }



  } catch (error) {
   const err: string = catchErrorHandle(error, "Failed to fetch users")
      throw new Error(err)
  }
});
export const removeUser = createAsyncThunk('/adminUserData/removeuser', async ({ deleteUser, updatedProfile }: { deleteUser: string, updatedProfile: { isDelete: true } }, { rejectWithValue }) => {
  try {

    const response = await apiService.patch(
      `member/profile/update/${deleteUser}`,
      {
        profileData: updatedProfile, // Use the up-to-date object
      },
      { withCredentials: true })

    if (response.status === 201) {
      return response.data.updatedData;
    } else {
      return rejectWithValue("something went to wrong")
    }



  } catch (error) {
    const err: string = catchErrorHandle(error, "Failed to delete")
      throw new Error(err)
  }
});
export const softDeleteUser = createAsyncThunk("/adminUserData/undelete", async (deleteUser, updatedProfile) => {
  try {
    const response = await apiService.patch(
      `member/profile/update/${deleteUser}`,
      {
        profileData: updatedProfile, // Use the up-to-date object
      },
      { withCredentials: true }
    );

    return response.data.updatedData
  } catch (error) {
     const err: string = catchErrorHandle(error, "Failed to update")
        throw new Error(err)
  }
})
export const updateUser = createAsyncThunk("/adminUserData/update", async ({ userId, updatedData }: { userId: string | number | undefined; updatedData: User }) => {

  try {
    const response = await apiService.patch(
      `member/profile/update/${userId}`,
      {
        profileData: updatedData,
      },
      { withCredentials: true }
    );


    return response.data.updatedData
  } catch (error) {
     const err: string = catchErrorHandle(error, "Failed to update")
      throw new Error(err)
  }

})


