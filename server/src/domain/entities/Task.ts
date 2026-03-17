import { ObjectId } from "mongoose";
import {approvalType,priorityType,statusType,commentType} from "../../types/taskTypes"

export class Task {
 
  id?: string | ObjectId;
  assignedUser?: string;
  deadline?: string;
  description?: string;
  name?: string;
  priority?: priorityType;
  projectId?: string;
  status?: statusType;
  project?:string;
  approvalStatus?:approvalType;
  rejectionMsg?:string;
  embedding?:number[];
  comments?:commentType[];
  attachedURLs?:string[];
   subTask?: { title: string; status: "Pending" | "Completed" }[];
  updatedAt?:string

  constructor({
    id,
    assignedUser,
    deadline,
    description,
    name,
    priority,
    projectId,
    status,
    project,
    approvalStatus,
    rejectionMsg,
    embedding,
    comments,
    attachedURLs,
    subTask,
    updatedAt
  }: {
    id?: ObjectId | string;
    description?: string;
    assignedUser?: string;
    deadline?: string;
    name?: string;
    priority?: priorityType;
    projectId?: string;
    status?: statusType;
    project?:string;
    approvalStatus?:approvalType;
    rejectionMsg?:string;
    embedding?:number[];
    comments?:commentType[],
    attachedURLs?:string[],
     subTask?: { title: string; status: "Pending" | "Completed" }[];
    updatedAt?:string
  }) {
    this.id = id;
    this.assignedUser = assignedUser;
    this.description = description;
    this.deadline = deadline;
    this.name = name;
    this.priority = priority;
    this.projectId = projectId;
    this.status = status;
    this.project=project;
    this.approvalStatus=approvalStatus;
    this.rejectionMsg=rejectionMsg;
    this.embedding=embedding;
    this.comments=comments;
    this.attachedURLs=attachedURLs;
    this.updatedAt = updatedAt;
    this.subTask =subTask;
  }
}
