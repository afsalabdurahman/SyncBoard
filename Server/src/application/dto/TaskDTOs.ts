import {Task,priorityType,statusType} from "../../domain/entities/Task"
export interface TaskRequestDTO {
  name?: string;
  description?: string;
  assignedUser?: string;
  deadline?: string;
  status?: statusType;
  priority?: priorityType;
  projectId?: string;
  project?: string;
}

export interface TaskResponseDTO{
    message:string,
    task:Task
}
