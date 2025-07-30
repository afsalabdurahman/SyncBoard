import { Task } from "../../../domain/entities/Task";
import { TaskRequstDTO } from "./requestDTO";
import { TaskResponseDTO } from "./responseDTO";
export class TaskMapper {
  static toEntity(dto: Task) {
    return new Task({
      name: dto.name,
      description: dto.description,
      assignedUser: dto.assignedUser,
      deadline: dto.deadline,
      priority: dto.priority,
      projectId: dto.projectId,
      status: dto.status,
      project:dto.project
    });
  }
  static toRegisterDTO(task: Task) {
    return new TaskResponseDTO({
      id: task.id,
      name: task.name,
      description: task.description,
      assignedUser: task.assignedUser,
      deadline: task.deadline,
      status: task.status,
      priority: task.priority,
      projectId: task.projectId,
      project:task.project
    });
  }
}
