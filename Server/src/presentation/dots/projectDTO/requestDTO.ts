import { ObjectId } from "mongoose";
import {
  Project,
  PriorityTypes,
  StatusTypes,
} from "../../../domain/entities/Project";
import { NotFoundError } from "../../../utils/errors";

export class ProjectRequstDTO {
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
    name,
    clientName,
    description,
    priority,
    assignedUsers,
    deadline,
    status,
    attachedUrl,
    projectAdminId,
  }: Project) {
    ((this.name = name),
      (this.clientName = clientName),
      (this.description = description),
      (this.priority = priority),
      (this.assignedUsers = assignedUsers),
      (this.deadline = deadline),
      (this.status = status),
      (this.attachedUrl = attachedUrl));
    this.projectAdminId = projectAdminId;
  }
  toValidate() {
    if (
      !this.name ||
      !this.clientName ||
      !this.description ||
      !this.priority ||
      !this.deadline ||
      !this.status ||
      !this.projectAdminId
    ) {
      throw new NotFoundError("Please enter all field");
    }
  }
}
