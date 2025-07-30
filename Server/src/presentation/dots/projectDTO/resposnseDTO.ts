import {
  PriorityTypes,
  Project,
  StatusTypes,
} from "../../../domain/entities/Project";

import { ObjectId } from "mongoose";
export class ProjectResponseDTO {
  id?: ObjectId | any;
  name?: string;
  description?: string;
  assignedUsers?: string[];
  deadline?: Date;
  status?: StatusTypes;
  priority?: PriorityTypes;
  clientName?: string;
  projectAdminId?: string;
  attachedUrl?: string[];

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
  }: Project) {
    ((this.id = id),
      (this.name = name),
      (this.description = description),
      (this.assignedUsers = assignedUsers),
      (this.deadline = deadline),
      (this.status = status),
      (this.priority = priority),
      (this.clientName = clientName),
      (this.projectAdminId = projectAdminId),
      (this.attachedUrl = attachedUrl));
  }
}
