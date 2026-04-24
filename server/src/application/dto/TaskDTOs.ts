import { Types } from "mongoose";

import { TaskPriority, TaskStatus } from "../mappers/TaskMapper";
import { Task as TaskEntity } from "../../domain/entities/Task";
export interface TaskRequestDTO {
  name?: string;
  description?: string;
  assignedUser?: string;
  deadline?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  project?: string;
  attachedURLs?:string[];
 subTask?: { title: string; status: "Pending" | "Completed" ,estimate:number}[];
}

export interface TaskResponseDTO{
    message:string,
    task:TaskEntity
}

export interface CompletedTaskResponseDTO {
  id: string;
  taskName: string;
  project: string;
  username: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date | string; // depending on what you get from DB
  rejectionReason?: string | null;
}
export interface Task {
  _id: Types.ObjectId | string;
  name: string;
  description: string;
  project: string;
  projectId: string;
  assignedUser: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string; 
  embedding?: number[]; 
}
export interface TaskPaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  limit: number;
}
export interface commentsDTO {
  name:string;
  text:string;
  urls:string[];
  timestamp:Date | string;
  attachments?: string[] 
}
export interface projectSpecifyTaskCount{
  total_task:number;
  total_members:number;
  overdue_task:number;
  completed_task:number;
  projectProgress?:number;
}
export interface donetChartData{
  todo:number;
  inprogress:number;
  completed:number;
}