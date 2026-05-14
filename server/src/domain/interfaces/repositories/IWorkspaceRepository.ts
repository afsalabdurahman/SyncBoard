import { WorkspaceDoument } from "../../../infrastructure/database/models/WorkspaceModel";
import { Workspace } from "../../entities/Workspace";
import mongoose, { Types } from "mongoose";
export interface IWorkspaceRepository {
  create(workspaceEntity: Workspace): Promise<Workspace|null>;
  findbyWorkSpaceName?(name: string): Promise<Workspace | null>;
  findbySlug(slug: string): Promise<Workspace |null>;
  save?(workspace: Workspace): Promise<void>;
  addMemberToWorkspace?(
    slug: string,
    userId: string|mongoose.Types.ObjectId,
    role: string,
    name: string,
    email: string,
    title:string,
    permission?:string,
  ): Promise<Workspace | null>;
  allWorkspace?(email: string): Promise<Workspace | null>;
  findByObjectId(id: mongoose.Types.ObjectId): Promise<Workspace | null>;
  addlogId?(workspaceId:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>
  updateWorkspaceDate(workspaceId:string,merge:Record<string,string>):Promise<Workspace | null>
  findAll():Promise<WorkspaceDoument[]>
  findWorkspacesByUserId(userId:string):Promise<Workspace[]|null>
}
