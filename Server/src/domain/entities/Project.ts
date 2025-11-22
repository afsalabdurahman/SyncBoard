import mongoose, { ObjectId,Schema,Types } from "mongoose";
import {PriorityTypes,StatusTypes} from "../../types/projectTypes"


export class Project {
  _id?: ObjectId | string;
  name?: string;
  description?: string;
  assignedUsers?: string[];
  deadline?: Date;
  status?: StatusTypes;
  priority?: PriorityTypes;
  clientName?: string;
  projectAdminId?: Types.ObjectId | string;
  workspaceId?:Types.ObjectId | string;
  attachedUrl?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  

  constructor({
    _id,
    name,
    description,
    assignedUsers,
    deadline,
    status,
    priority,
    clientName,
    projectAdminId,
    workspaceId,
    attachedUrl,
    createdAt,
    updatedAt,
  }: {
    _id?: ObjectId | string;
    name?: string;
    description?: string;
    assignedUsers?: string[];
    deadline?: Date;
    status?: StatusTypes;
    priority?: PriorityTypes;
    clientName?: string;
    projectAdminId?: string|Types.ObjectId;
    workspaceId: string|Types.ObjectId;
    attachedUrl?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.assignedUsers = assignedUsers;
    this.deadline = deadline;
    this.status = status;
    this.priority = priority;
    this.clientName = clientName;
    this.projectAdminId = projectAdminId;
    this.workspaceId =workspaceId;
    this.attachedUrl = attachedUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
