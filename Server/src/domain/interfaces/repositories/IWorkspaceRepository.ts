import { Workspace } from "../../entities/Workspace";
import mongoose, { Types } from "mongoose";
export interface IWorkspaceRepository {
  create(workspace: Workspace): Promise<Workspace|null>;
  findbyWorkSpaceName?(name: string): Promise<Workspace | null>;
  findbySlug?(slug: string): Promise<Workspace |any>;
  save?(workspace: Workspace): Promise<void>;
  addMemberToWorkspace?(
    slug: string,
    userId: string,
    role: string,
    name: string,
    email: string,
    title:string,
  ): Promise<void>;
  allWorkspace?(email: string): Promise<Workspace | null>;
  findByObjectId(id: mongoose.Types.ObjectId): Promise<any | null>;
  addlogId(workspaceId:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>
}
