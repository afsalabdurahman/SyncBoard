import { ROUTES } from "../../Constants/routeConstan";
import apiService from "../../Services/apiServices/apiService";
import { catchErrorHandle } from "../../Utility/catchErrorHandle";
import { FormState } from "../components/UserModal";
import { Task } from "../types/taskTypes";

/* ---------------- TYPES ---------------- */

interface TaskResponse {
  items: Task[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

/* ---------------- FETCH TASKS ---------------- */

export const fetchTasks = async (
  workspaceId: string,
  page: number,
  limit: number,
  projectId:string,
): Promise<TaskResponse> => {

  const { data } = await apiService.get<TaskResponse>(
ROUTES.TASKS.FETCH_TASK
  .replace(":workspaceId", workspaceId) + `?projectId=${projectId ?? ""}`,
    {
      params: { page, limit },
    }
  );

  return data;
};

/* ---------------- UPDATE STATUS ---------------- */

export const updateTaskStatus = async (
  taskId: string,
  status: "Approved" | "Rejected",
  msg: string | null
): Promise<void> => {

  await apiService.patch(
    ROUTES.TASKS.STATUS_UPDATE.replace(":taskId",taskId),
    { status, msg }
  );

};

/* ---------------- DELETE ATTACHMENT ---------------- */

export const deleteAttachmentUrl = async (
  taskId: string,
  url: string
): Promise<string> => {

  try {

    const { data } = await apiService.patch(
      ROUTES.TASKS.DELETE_ATTACHMENTS.replace(":taskId",taskId),
      { attachment: url }
    );

    return data?.message ?? "Deleted";

  } catch (error) {
const err: string = catchErrorHandle(error, "Failed to attach")
        throw new Error(err)}
   
};

export const deleteSubTaskApi = async(taskId,subTask) =>{
try {
  await apiService.patch(ROUTES.TASKS.DELETE_SUBTASKS.replace(":taskId",taskId),{subTask})
} catch (error) {
      const err: string = catchErrorHandle(error, "Updation failed")
      throw new Error(err)   
      }
}
export const deleteProjectAttachment=async (projectId:string,url:string)=>{
try {
  await apiService.patch(ROUTES.TASKS.DELETE_PROJECT_ATTTACHMENT.replace(":projectId",projectId),{url})
  return true
} catch (error) {
      const err: string = catchErrorHandle(error, "Updation failed")
      throw new Error(err)  
}
}
export const updateTaskCriteria=async(id:string,title:string)=>{
 await apiService.patch(ROUTES.TASKS.UPDATE_ACCEPTANCE_CRITERIA.replace(":id",id),{
    title
  })
}
export const updateUserInWorkspace =async (workspaceId:string,userId:string,formData:Record<string,any>)=>{
  try {
    apiService.post(`/workspace/update/member/profile/${userId}/${workspaceId}`,{formData})
  } catch (error) {
   console.log(error) 
  }
}