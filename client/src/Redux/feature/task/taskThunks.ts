import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../Services/apiServices/apiService";



export const fetchTaskData = createAsyncThunk('/adminTaskData/fetchTasks', async ({workspaceid, page, limit }: {workspaceid:string, page: number, limit: number }, { rejectWithValue }) => {
  try {

    const response = await apiService.get(`task/mytasks/${workspaceid}?page=${page}&limit=${limit}`);

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
    console.log(error)
  }
});

export const addTaskApi = createAsyncThunk("/adminTaskData/add", async (newTask) => {
  try {
    const response = await apiService.post("task/create", { newTask })

    return response.data


  } catch (error) {
    console.log(error)
  }
})
export const updateTaskApi = createAsyncThunk("adminTaskData/update", async (updatedTask) => {
  try {
    let id = updatedTask.id

    const response = await apiService.patch(`task/update/${id}`, {
      updatedTask
    });

    return response.data.task
  } catch (error) {
    console.log(error)
  }
})
export const deleteTaskApi = createAsyncThunk("adminTaskData/delete", async (deleteTaskId: string) => {
  try {

    const response = await apiService.delete(`task/delete/${deleteTaskId}`);
    if (response.status == 200) {
      return deleteTaskId
    }
  } catch (error) {
    console.log(error)
  }
})

