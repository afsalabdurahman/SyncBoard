import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../Services/apiServices/apiService";
import { catchErrorHandle } from "../../../Utility/catchErrorHandle";
import { ROUTES } from "../../../Constants/routeConstan";



export const fetchTaskData = createAsyncThunk('/adminTaskData/fetchTasks', async ({workspaceid, page, limit,projectId }: {workspaceid:string, page: number, limit: number,projectId:string|null }, { rejectWithValue }) => {
  try {

    const response = await apiService.get(`task/mytasks/${workspaceid}?page=${page}&limit=${limit}&projectId=${projectId??""}`);

    if (response.status == 200) {
      return {
        list: response.data.items,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalItems: response.data.totalItems
      };
    } else {
      return rejectWithValue("something went to wrong")
    }



  } catch (error) {
     const err: string = catchErrorHandle(error, "Failed to create Task")
      throw new Error(err)
  }
});

export const addTaskApi = createAsyncThunk("/adminTaskData/add", async (newTask) => {
  try {
    const response = await apiService.post(ROUTES.TASKS.CREATE, { newTask })

    return response.data


  } catch (error) {
   
   const err: string = catchErrorHandle(error, "Failed to create Task")
      throw new Error(err)
  }
})
export const updateTaskApi = createAsyncThunk("adminTaskData/update", async (updatedTask) => {
  try {
    const id = updatedTask.id

    const response = await apiService.patch(ROUTES.TASKS.UPDATE.replace(":id",id), {
      updatedTask
    });

    return response.data.task
  } catch (error) {
  const err: string = catchErrorHandle(error, "Failed to create Task")
      throw new Error(err)
  }
})
export const deleteTaskApi = createAsyncThunk("adminTaskData/delete", async (deleteTaskId: string) => {
  try {

    const response = await apiService.delete(ROUTES.TASKS.DELETE.replace(":deleteTaskId",deleteTaskId));
    if (response.status == 200) {
      return deleteTaskId
    }
  } catch (error) {
       const err: string = catchErrorHandle(error, "Task is Deleted")
      throw new Error(err)
  }
})

