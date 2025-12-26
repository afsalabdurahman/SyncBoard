import { Types } from "mongoose";
import {Task,priorityType,statusType} from "../../domain/entities/Task"
import { TaskPriority, TaskStatus } from "../mappers/TaskMapper";
export interface TaskRequestDTO {
  name?: string;
  description?: string;
  assignedUser?: string;
  deadline?: string;
  status?: statusType;
  priority?: priorityType;
  projectId?: string;
  project?: string;
  attachedURLs?:string[]
}

export interface TaskResponseDTO{
    message:string,
    task:Task
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
