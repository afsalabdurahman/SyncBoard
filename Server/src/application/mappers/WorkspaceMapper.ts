import { Workspace } from "../../domain/entities/Workspace";
import { WorkspaceRequestDTO, WorkspaceResponseDTO } from "../dto/WorkspaceDTOs";
import { User } from "../../domain/entities/User";
interface Member {
  userId: string;
  title: string;
}
export class WorkspaceMapper{
    static mapWorkspaceToEntity(dto:WorkspaceRequestDTO,userID:string,title:string):Workspace{
        
        return new Workspace ({
         name:dto.workspaceName,
         role:dto.role,
         slug:dto.slug,
         ownerId:dto.ownerId,
         members:[{userId:userID,title}]
        })
    }
    static mapEntityToWorkspace(user:User,workspace:Workspace):WorkspaceResponseDTO{
    return{
        user,
        workspace
    }
    }
}