import { Workspace, } from "../../domain/entities/Workspace";
import { WorkspaceRequestDTO, WorkspaceResponseDTO } from "../dto/WorkspaceDTOs";
import { User } from "../../domain/entities/User";
import { z } from "zod";
import { Types } from "mongoose";
import { stringToMongoObj } from "../../utils/convertMongoObject";

export class WorkspaceMapper {
  static mapWorkspaceToEntity(dto: WorkspaceRequestDTO, userID: string, title: string,): Workspace {

    return new Workspace({
      name: dto.workspaceName,
      role: dto.role,
      slug: dto.slug,
      ownerId: stringToMongoObj( dto.ownerId),
      members: [{ userId: new Types.ObjectId(userID), title, permissions: "Admin", role: dto.role,isOnline:true }],
      status: "Active",
currentSubscription:null,
stripeCustomerId:"",
      storage: 1,
    })
  }
  static mapEntityToWorkspace(user: User, workspace: Workspace): WorkspaceResponseDTO {
    return {
      user,
      workspace
    }
  }
  static validateWorkspace(input: WorkspaceRequestDTO) {

    const isValid = z.object({

      email: z
        .string({ required_error: "Email is required" })
        .trim()
        .min(1, "Email is required")
        .email("Invalid email format"),

      ownerId: z
        .string({ required_error: "Owner ID is required" })
        .trim()
        .min(1, "Owner ID is required"),

      title: z
        .string({ required_error: "Title is required" })
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must not exceed 100 characters")
        .regex(
          /^[a-zA-Z0-9][a-zA-Z0-9 _-]*[a-zA-Z0-9]$/,
          "Title name must start and end with a letter or number. Only letters, numbers, spaces, hyphens (-) and underscores (_) are allowed."
        ),

      workspaceName: z
        .string({ required_error: "Workspace name is required" })
        .min(3, "Workspace name must be at least 3 characters")
        .max(20, "Workspace name must not exceed 20 characters")
        .regex(
          /^[a-zA-Z0-9][a-zA-Z0-9 _-]*[a-zA-Z0-9]$/,
          "Workspace name must start and end with a letter or number. Only letters, numbers, spaces, hyphens (-) and underscores (_) are allowed."
        ),

    });

    return isValid.safeParse(input);
  }
  static workspaceUpdateValidator(input: Record<string, string>) {
    const isValid = z.object({
      name: z
        .string()
        .min(1, "Name cannot be empty")
        .max(10, "Name must be at most 10 characters")
        .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Only letters allowed, spaces only in middle").optional(),

      plan: z.enum(["free", "basic", "pro", "enterprise"]).optional(),
      status: z.enum(["active", "suspend"]).optional()
    });

    return isValid.safeParse(input);

  }
  static listOfWorkspace(input: Workspace[]) {
    const list = input.map((workspace) => {
      return {
        name: workspace.name,
        id: workspace?._id,
      }
    })
    return list
  }
}