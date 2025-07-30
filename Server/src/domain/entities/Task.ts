import { ObjectId } from "mongoose";

export type statusType = "To Do" | "In Progress" | "Completed";
export type priorityType = "Low" | "Medium" | "High";

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
  }
}
