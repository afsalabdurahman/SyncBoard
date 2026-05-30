import mongoose, { Types } from "mongoose";
import { listWorkspace, WorkspaceRequestDTO,WorkspaceResponseDTO } from "../../dto/WorkspaceDTOs";
import { Workspace } from "../../../domain/entities/Workspace";
import { UserInWorkspaceDTO } from "../../dto/UserDTO";

export interface IWorkspace {
      createWorkspace(input: WorkspaceRequestDTO): Promise<WorkspaceResponseDTO>;
   
    findWorkspace(id:Types.ObjectId):Promise<Workspace|null>;
    updateWorkspace(id:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>
    updateWorkspaceData(id:string,merge:Record<string, string>):Promise<void>
     generateWorkspaceExcel(): Promise<Buffer>;
      listWorkspacesByUserId(userId:string):Promise<listWorkspace[]>;
      updatePermission(workspaceId:string,userId:string,permission:string):Promise<void>
      findPermission(workspaceId:string,userId:string):Promise<string>
updateUserInWorkspace(workspaceId:string,userId:string,data:UserInWorkspaceDTO):Promise<void>
workspaceUserStatus(workspaceId:Types.ObjectId,userId:Types.ObjectId):Promise<UserInWorkspaceDTO|null>
}