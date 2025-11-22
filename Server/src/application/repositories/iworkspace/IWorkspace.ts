import mongoose, { Types } from "mongoose";
<<<<<<< HEAD
import { WorkspaceRequestDTO,WorkspaceResponseDTO } from "../../dto/WorkspaceDTOs";
=======
import { AbuseRequestDTO, WorkspaceRequestDTO,WorkspaceResponseDTO } from "../../dto/WorkspaceDTOs";
>>>>>>> rag

export interface IWorkspace {
      createWorkspace(input: WorkspaceRequestDTO): Promise<WorkspaceResponseDTO>;
   
    findWorkspace(id:Types.ObjectId):Promise<any>;
    updateWorkspace(id:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>
    updateWorkspaceData(id:string,merge:any):Promise<void>
<<<<<<< HEAD
=======
   
>>>>>>> rag
}