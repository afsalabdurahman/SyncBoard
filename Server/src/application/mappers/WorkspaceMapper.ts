import { Workspace, workspaceStatus } from "../../domain/entities/Workspace";
import { WorkspaceRequestDTO, WorkspaceResponseDTO } from "../dto/WorkspaceDTOs";
import { User } from "../../domain/entities/User";
import { z } from "zod";
interface Member {
  userId: string;
  title: string;
}
export class WorkspaceMapper{
    static mapWorkspaceToEntity(dto:WorkspaceRequestDTO,userID:string,title:string,):Workspace{
      
        return new Workspace ({
         name:dto.WorkspaceName,
         role:dto.role,
         slug:dto.slug,
         ownerId:dto.ownerId,
         members:[{userId:userID,title}],
         status:"Active",
         storage:1,
        })
    }
    static mapEntityToWorkspace(user:User,workspace:Workspace):WorkspaceResponseDTO{
    return{
        user,
        workspace
    }
    }
    static validateWorkspace(input:WorkspaceRequestDTO){
    let isValid = z.object({
  email: z.string().email(),                      
  ownerId: z.string(),            
  slug: z.string(),
         
  title: z.string().trim().min(1, "Title is required"),
  WorkspaceName: z.string().trim().min(1, "Workspace name is required"),
    
    })
    return isValid.safeParse(input);

}
}