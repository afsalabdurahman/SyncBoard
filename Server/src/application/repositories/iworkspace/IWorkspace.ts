import mongoose, { Types } from "mongoose";
import { WorkspaceRequestDTO,WorkspaceResponseDTO } from "../../dto/WorkspaceDTOs";
import { Workspace } from "../../../domain/entities/Workspace";
import { WorkspaceDoument } from "../../../infrastructure/database/models/WorkspaceModel";

export interface IWorkspace {
      createWorkspace(input: WorkspaceRequestDTO): Promise<WorkspaceResponseDTO>;
   
    findWorkspace(id:Types.ObjectId):Promise<Workspace|null>;
    updateWorkspace(id:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>
    updateWorkspaceData(id:string,merge:Record<string, string>):Promise<void>
   
}