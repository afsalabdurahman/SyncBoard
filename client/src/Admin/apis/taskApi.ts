


import apiService from "../../Services/apiServices/apiService";
import { Task } from "../types/taskTypes";


export const fetchTasks = async (workspaceid,page,rowPerpage) => {

  const response = await apiService.get(`task/completed/${workspaceid}?page=${page}&limit=${rowPerpage}`);
  return response.data
};

export const updateTaskStatus = async (taskId: string, status: "Approved" | "Rejected", msg: string | null): Promise<void> => {
  await apiService.patch(`task/update/approval/status/${taskId}`, { status, msg });
};
export const deleteAttchedUrl = async (taskId:string,url:string):Promise<string>=>{
 try {
   const response =await apiService.patch(`task/attachment/delete/${taskId}`,{attachment:url})
  if(response.status==200) {
    return "Deleted"
  }else{
   return response.data.message
  }

 } catch (error) {

  throw new Error(error) 
 }
}