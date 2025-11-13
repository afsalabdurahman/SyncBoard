import mongoose, { Types } from "mongoose";
import { WorkspaceRequestDTO,WorkspaceResponseDTO } from "../../dto/WorkspaceDTOs";

export interface IWorkspace {
      createWorkspace(input: WorkspaceRequestDTO): Promise<WorkspaceResponseDTO>;
   
    findWorkspace(id:Types.ObjectId):Promise<any>;
    updateWorkspace(id:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>
    updateWorkspaceData(id:string,merge:any):Promise<void>
}