import { Task } from "../../entities/Task";
import { commentType } from "../../../types/taskTypes";
import { Types } from "mongoose";
export interface ITaskRepository {
  create(dto: Task): Promise<Task | null>;
  getAlltask(): Promise<Task[] | null>;
  updatetask(taskId: string, merged: Record<string, string>): Promise<Task|null>;
  deleteTask(taskId: string): Promise<void>;
  myTask(userName: string, query?: string): Promise<Task[]>;
  updateTaskStatus(taskId: string, updatedStatus: string): Promise<void>;
  allCompletedTasks(workspaceid:Types.ObjectId): Promise<{completedTasks:Task[],taskReject:Task[]}>;
  updateApprovalStatus(taskId: string, status: string, msg?: string | null): Promise<void>
  findTaskByProjectId(projectId: string,taskfilter:string|null): Promise<Task[] | null>;
  countTask(): Promise<number>
  getPagenationaTask(workspaceId:Types.ObjectId,page: number, limit: number, skip: number): Promise<{
    items: Task[];
    totalItems: number
 }>;
  
    addComments(taskId: string, comments: commentType):Promise<Task|null>
    getTaskbyId(taskId:string):Promise<Task|null>;
    deleteAttachment(taskId:string,url:string):Promise<Task|null>
  
}
