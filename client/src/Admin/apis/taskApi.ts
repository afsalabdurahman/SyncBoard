import apiService from "../../Services/apiServices/apiService";
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
  limit: number
): Promise<TaskResponse> => {

  const { data } = await apiService.get<TaskResponse>(
    `task/completed/${workspaceId}`,
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
    `task/update/approval/status/${taskId}`,
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
      `task/attachment/delete/${taskId}`,
      { attachment: url }
    );

    return data?.message ?? "Deleted";

  } catch (error: unknown) {

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to delete attachment");
  }
};