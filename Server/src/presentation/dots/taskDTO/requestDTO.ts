import { ObjectId } from "mongoose";
import {Task,priorityType,statusType} from "../../../domain/entities/Task"
import { NotFoundError } from "../../../utils/errors";

export class TaskRequstDTO {
  name?: string;
  description?: string;
  assignedUser?: string;
  deadline?: string;
  status?: statusType;
  priority?: priorityType;
  projectId?:string;
  project?:string;
  

  constructor({
    name,
    description,
    assignedUser,
    deadline,
    status,
    priority,
    projectId,
    project,
    
  }: Task) {
    ((this.name = name),
      
      (this.description = description),
      (this.priority = priority),
      (this.assignedUser = assignedUser),
      (this.deadline = deadline),
      (this.status = status),
      (this.projectId = projectId),
     this.project = project);
   
  }
  toValidate() {
    if (
      !this.name || 
      !this.description ||
      !this.priority ||
      !this.deadline ||
      !this.status ||
      !this.projectId
    ) {
      throw new NotFoundError("Please enter all field");
    }
  }
}
