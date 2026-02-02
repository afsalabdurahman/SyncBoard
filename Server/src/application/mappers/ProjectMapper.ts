import { Project } from "../../domain/entities/Project";
import {  ProjectRequstDTO, ProjectResponseDTO } from "../dto/ProjectDTOs";
import { z } from "zod";

import mongoose from "mongoose";


export const StatusTypesSchema = z.enum(["Pending", "In Progress", "Completed", "On Hold", "Planning"]);
export type StatusTypes = z.infer<typeof StatusTypesSchema>;

export const PriorityTypesSchema = z.enum(["Low", "Medium", "High", "Critical"]);
export type PriorityTypes = z.infer<typeof PriorityTypesSchema>;


export class ProjectMapper {
  static mapProjectToEntity(input: ProjectRequstDTO,workspaceId:string): Project {
    return new Project({
      name: input.name,
      description: input.description,
      assignedUsers: input.assignedUsers,
      deadline: input.deadline,
      status: input.status,
      priority: input.priority,
      clientName: input.clientName,
      
      projectAdminId: new mongoose.Types.ObjectId (input.projectAdminId),
      workspaceId: new  mongoose.Types.ObjectId (workspaceId),
      attachedUrl: input.attachedUrl
        ? Array.isArray(input.attachedUrl)
          ? input.attachedUrl
          : [input.attachedUrl] 
        : undefined,
    });
  }
static mapEntityToProject(
  msg: string,
  savedProject: Project
): ProjectResponseDTO {

  const project = new Project({
    ...savedProject,
    workspaceId: savedProject.workspaceId || new mongoose.Types.ObjectId()
  });

  return {
    message: msg,
    project
  };
}


  static ValidateProjectData(input: ProjectRequstDTO) {

    const isValid = z.object({
      name: z.string().min(1, "Project name is required").max(100,"word count is exceed"),
      description: z.string().min(1, "Description is required").max(1000,"word count is exceed"),
      assignedUsers: z.array(z.string().min(1)).min(1, "At least one user must be assigned"),
      status: StatusTypesSchema,
      priority: PriorityTypesSchema,
      clientName: z.string().min(1, "Client name is required"),
      projectAdminId: z.string().min(1, "Project Admin ID is required"),

    })

    return isValid.safeParse(input);
  }

}
