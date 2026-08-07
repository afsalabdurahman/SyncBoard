import { User } from "../../../Admin/types/userTypes";
import apiService from "../../../Services/apiServices/apiService";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { catchErrorHandle } from "../../../Utility/catchErrorHandle";
import { ROUTES } from "../../../Constants/routeConstan";

export const fetchAllUsers = createAsyncThunk('/adminUserData/fetchusers', async ({ page, limit, workspaceslug,projectId }: { page: number, limit: number, workspaceslug: string,projectId:string|null  }, { rejectWithValue }) => {
  try {

    const response = await apiService.get(ROUTES.WORKSPACE.FECTCH_ALL_USERS.replace(":workspaceslug",workspaceslug)+`?page=${page}&limit=${limit}&projectId=${projectId}`);
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
export const removeUser = createAsyncThunk('/adminUserData/removeuser', async ({ deleteUser,workspaceId, formData }: { deleteUser: string,workspaceId:string, formData: { isDeleted: true } }, { rejectWithValue }) => {
  try {

    const response = await apiService.post(
      ROUTES.MEMBER.REMOVE_MEMBER.replace(":userId",deleteUser).replace(":workspaceId",workspaceId),
      {
        formData:formData, // Use the up-to-date object
      },
      { withCredentials: true })

    if (response.status === 200) {
      return true
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
           ROUTES.MEMBER.REMOVE_MEMBER.replace(":deleteUser",deleteUser),
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
    ROUTES.MEMBER.UPDATE_MEMBER.replace(":userId",userId),
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


