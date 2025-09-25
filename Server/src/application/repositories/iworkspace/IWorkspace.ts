import mongoose, { Types } from "mongoose";
import { Workspace } from "../../../domain/entities/Workspace";
import { WorkspaceRequestDTO,WorkspaceResponseDTO } from "../../dto/WorkspaceDTOs";
import { WorkspaceRepository } from "../../../infrastructure/repositories/WorkspaceRepository";

export interface IWorkspace {
      createWorkspace(input: WorkspaceRequestDTO): Promise<WorkspaceResponseDTO>;
   
    findWorkspace(id:Types.ObjectId):Promise<any>;
    updateWorkspace(id:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>
}