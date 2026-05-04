import { Types } from "mongoose";

import { TaskPriority, TaskStatus } from "../mappers/TaskMapper";
import { Task as TaskEntity } from "../../domain/entities/Task";
import { priorityType } from "../../types/taskTypes";
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
  acceptanceCriteria?:{title: string; status: "Pending" | "Completed"}[];
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
export interface TaskResponseChartDTO{
 id: number;
  title: string;
  status: "todo" | "inprogress" | "completed";
  priority: "Low" | "Medium" | "High";
  date: string;
  assignee: string;
  color: string;
  open: boolean;
  subtasks: SubTask[];
}
interface SubTask {
  id: number;
  title: string;
  done: boolean;
}
export interface FormattedSubTask {
  id: number;
  title: string;
  done: boolean;
}

export interface FormattedTask {
  id: string | Types.ObjectId | undefined;
  title: string | undefined;
  status: string;
  userName:string;
  priority: priorityType | undefined;
  date: string;
  assignee: string;
  color: string;
  open: boolean;
  subtasks: FormattedSubTask[];
}
export interface DbTaskUI {
  _id: Types.ObjectId;
  name: string;
  assignedUser: string;
  description: string;
  deadline: string;
  priority: string;
  status: string;
  project: string;

  comments: {
    name: string;
    text: string;
    urls: string[];
    timestamp: string;
  }[];

  attachedURLs: string[];

  subTask: {
    title: string;
    estimate: number;
    status: string;
  }[];

  acceptanceCriteria: {
    title: string;
    status: string;
  }[];
}
export interface UIresponseTask{

  _id: string;
  name: string;
  description: string;

  assignedUser: {
    name: string;
    email: string;
  };

  project: {
    name: string;
  };

  deadline: string;
  priority: string;
  status: string;
  approvalStatus: string;

  subTask: {
    id: number;
    title: string;
    estimate: number;
    done: boolean;
    status: string;
  }[];

  approvalCriteria: {
    id: number;
    title: string;
    completed: boolean;
  }[];

  comments: {
    id: number;
    user: string;
    text: string;
    time: string;
    attachments: string[];
  }[];

  attachedURLs: {
    id: number;
    label: string;
    link: string;
  }[];

}