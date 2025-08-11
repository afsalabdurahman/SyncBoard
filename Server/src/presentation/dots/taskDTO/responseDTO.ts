import { Task, priorityType, statusType } from "../../../domain/entities/Task";
import { ObjectId } from "mongoose";
export class TaskResponseDTO {
  id?: ObjectId | any;
  name?: string;
  description?: string;
  assignedUser?: string;
  deadline?: string;
  status?: statusType;
  priority?: priorityType;
  projectId?: string;
  project?: string;

  constructor({
    id,
    name,
    description,
    assignedUser,
    deadline,
    status,
    priority,

    projectId,
    project,
  }: Task) {
    ((this.id = id),
      (this.name = name),
      (this.description = description),
      (this.assignedUser = assignedUser),
      (this.deadline = deadline),
      (this.status = status),
      (this.priority = priority),
      (this.projectId = projectId),
      (this.project = project));
  }
}
export class CompletedTaskReposnseDTO {
  taskName?: string;
  project?: string;
  username?: string;
  status?: string;
  submittedAt?: string;
  constructor({
    taskName,
    project,
    username,
    status,
    submittedAt,
  }: {
    taskName?: string;
    project?: string;
    username?: string;
    status?: string;
    submittedAt?: string;
  }) {
    ((this.taskName = taskName),
      (this.project = project),
      (this.username = username));
    ((this.status = status), (this.submittedAt = submittedAt));
  }
}
