import { Project } from "../../domain/entities/Project";
import {  ProjectRequstDTO, ProjectResponseDTO } from "../dto/ProjectDTOs";
import { z } from "zod";

import mongoose from "mongoose";
import { string } from "zod/v4";
import { stringToMongoObj } from "../../utils/convertMongoObject";


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
      
      projectAdminId: stringToMongoObj(input.projectAdminId),
      workspaceId: stringToMongoObj (workspaceId),
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
      name:   z
    .string()
    .trim()
    .min(4, "Project name is required")
    .max(100, "Word count exceeded")
    .regex(/^[A-Za-z0-9][A-Za-z0-9 ]*$/, {
      message:
        "Name must start with a letter or number and cannot contain special characters",
    }),
      description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Word count exceeded")
    .regex(/^[A-Za-z0-9][A-Za-z0-9\s.,!?'"()-]*$/, {
      message:
        "Description must start with a letter or number and cannot start with space or special characters",
    }),
      assignedUsers: z.array(z.string().min(1)).min(1, "At least one user must be assigned"),
      status: StatusTypesSchema,
      priority: PriorityTypesSchema,
      clientName: z.string().min(1, "Client name is required"),
      projectAdminId: z.string().min(1, "Project Admin ID is required"),

    })

    return isValid.safeParse(input);
  }

}
