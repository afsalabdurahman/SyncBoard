import { ObjectId } from "mongoose";

export type PriorityTypes = "Low" | "Medium" | "High";
export type StatusTypes = "Planning" | "In Progress" | "Completed" | "On Hold";

export class Project {
  id?: ObjectId | string;
  name?: string;
  description?: string;
  assignedUsers?: string[];
  deadline?: Date;
  status?: StatusTypes;
  priority?: PriorityTypes;
  clientName?: string;
  projectAdminId?: string;
  attachedUrl?: string[];
  createdAt?: Date;
  updatedAt?: Date; // Corrected typo from `updateAt` to `updatedAt`

  constructor({
    id,
    name,
    description,
    assignedUsers,
    deadline,
    status,
    priority,
    clientName,
    projectAdminId,
    attachedUrl,
    createdAt,
    updatedAt,
  }: {
    id?: ObjectId | string;
    name?: string;
    description?: string;
    assignedUsers?: string[];
    deadline?: Date;
    status?: StatusTypes;
    priority?: PriorityTypes;
    clientName?: string;
    projectAdminId?: string;
    attachedUrl?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.assignedUsers = assignedUsers;
    this.deadline = deadline;
    this.status = status;
    this.priority = priority;
    this.clientName = clientName;
    this.projectAdminId = projectAdminId;
    this.attachedUrl = attachedUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
