import { Project } from "../../domain/entities/Project";
import { ProjectRequstDTO, ProjectResponseDTO } from "../dto/ProjectDTOs";
import { z } from "zod";

export const StatusTypesSchema = z.enum(["Pending", "In Progress", "Completed", "On Hold", "Planning"]);
export type StatusTypes = z.infer<typeof StatusTypesSchema>;

export const PriorityTypesSchema = z.enum(["Low", "Medium", "High", "Critical"]);
export type PriorityTypes = z.infer<typeof PriorityTypesSchema>;


export class ProjectMapper {
  static mapProjectToEntity(input: ProjectRequstDTO): Project {
    return new Project({
      name: input.name,
      description: input.description,
      assignedUsers: input.assignedUsers,
      deadline: input.deadline,
      status: input.status,
      priority: input.priority,
      clientName: input.clientName,
      projectAdminId: input.projectAdminId,
      attachedUrl: input.attachedUrl
        ? Array.isArray(input.attachedUrl)
          ? input.attachedUrl
          : [input.attachedUrl] // wrap string into array
        : undefined,
    });
  }
  static mapEntityToProject(msg: string, savedProject: Project): ProjectResponseDTO {
    let project = new Project(savedProject)
    return {
      message: msg,
      project
    }
  }
  static ValidateProjectData(input: ProjectRequstDTO) {

    const isValid = z.object({
      name: z.string().min(1, "Project name is required"),
      description: z.string().min(1, "Description is required"),
      assignedUsers: z.array(z.string().min(1)).min(1, "At least one user must be assigned"),
      status: StatusTypesSchema,
      priority: PriorityTypesSchema,
      clientName: z.string().min(1, "Client name is required"),
      projectAdminId: z.string().min(1, "Project Admin ID is required"),

    })

    return isValid.safeParse(input);
  }

}
