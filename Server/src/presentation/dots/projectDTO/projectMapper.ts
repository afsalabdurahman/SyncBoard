import { Project } from "../../../domain/entities/Project";
import { ProjectRequstDTO } from "./requestDTO";
import { ProjectResponseDTO } from "./resposnseDTO";
export class ProjectMapper {
  static toEntity(dto: Project) {
    return new Project({
      name: dto.name,
      description: dto.description,
      assignedUsers: dto.assignedUsers,
      deadline: dto.deadline,
      status: dto.status,
      priority: dto.priority,
      clientName: dto.clientName,
      projectAdminId: dto.projectAdminId,
      attachedUrl: dto.attachedUrl,
      createdAt: new Date(),
    });
  }
  static toRegisterDTO(project: Project) {
    return new ProjectResponseDTO({
      id: project.id,
      name: project.name,
      description: project.description,
      assignedUsers: project.assignedUsers,
      deadline: project.deadline,
      status: project.status,
      priority: project.priority,
      clientName: project.clientName,
      projectAdminId: project.projectAdminId,
      attachedUrl: project.attachedUrl,
      createdAt: project.createdAt
    });
  }
}
