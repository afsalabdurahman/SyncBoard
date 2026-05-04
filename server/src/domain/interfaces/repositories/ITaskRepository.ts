import { Task } from "../../entities/Task";
import { commentType } from "../../../types/taskTypes";
import { Types } from "mongoose";
import { DbTaskUI, donetChartData, projectSpecifyTaskCount } from "../../../application/dto/TaskDTOs";
export interface ITaskRepository {
  create(dto: Task): Promise<Task | null>;
  getAlltask(): Promise<Task[] | null>;
  updatetask(taskId: string, merged: Record<string, string>): Promise<Task|null>;
  deleteTask(taskId: string): Promise<void>;
  myTask(userName: string, query?: string): Promise<Task[]>;
  updateTaskStatus(taskId: string, updatedStatus: string): Promise<void>;
  allCompletedTasks(workspaceid:Types.ObjectId,page?:number,limit?:number,skip?:number,projectId?:string|null): Promise<{completedTasks:Task[],taskReject:Task[],totalItems:number}>;
  updateApprovalStatus(taskId: string, status: string, msg?: string | null): Promise<void>
  findTaskByProjectId(projectId: string,taskfilter:string|null): Promise<Task[] | null>;
  countTask(): Promise<number>
  getPagenationaTask(workspaceId:Types.ObjectId,page: number, limit: number, skip: number,projectId:string|null): Promise<{
    items: Task[];
    totalItems: number
 }>;
  
    addComments(taskId: string, comments: commentType):Promise<Task|null>
    getTaskbyId(taskId:string):Promise<Task|null>;
    deleteAttachment(taskId:string,url:string):Promise<Task|null>
  deleteSubTask(taskId:Types.ObjectId,subtask:string):Promise<void>;
  updateSubTask (taskId:Types.ObjectId,title:string):Promise<void>;
    updateApprovalCriteria (taskId:Types.ObjectId,title:string):Promise<void>;
  findTaskCountByProjectId(projectId:string):Promise<projectSpecifyTaskCount>;
  donetChartData(projectId:string):Promise<donetChartData>;
  burnoutChartTask(projectId:string):Promise<Task[]>;
  findTaskApprovalstatus(projectId:string):Promise<Task[]>;
  findTaskById(taskId:Types.ObjectId):Promise<DbTaskUI|null>
}
