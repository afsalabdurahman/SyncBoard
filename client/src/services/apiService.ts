
import apiService from "./api";
import { Task } from "./TaskTypes";


export const fetchTasks = async (): Promise<Task[]> => {
  const response = await apiService.get("task/completed");
  return response.data;
};

export const updateTaskStatus = async (taskId: string, status: "Approved" | "Rejected", msg: string | null): Promise<void> => {
  await apiService.patch(`task/update/approval/status/${taskId}`, { status, msg });
};