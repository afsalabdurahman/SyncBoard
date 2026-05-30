import {  UserInWorkspaceDTO } from "../../../application/dto/UserDTO";
import { UserDoument } from "../../../infrastructure/database/models/UserModel";
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
    title:string,
    permission?:string,
  ): Promise<Workspace | null>;
  allWorkspace?(email: string): Promise<Workspace | null>;
  findByObjectId(id: mongoose.Types.ObjectId): Promise<Workspace | null>;
  addlogId?(workspaceId:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>
  updateWorkspaceDate(workspaceId:string,merge:Record<string,string>):Promise<Workspace | null>
  findAll():Promise<WorkspaceDoument[]>
  findWorkspacesByUserId(userId:string):Promise<{ id: string; name: string }[]|null>
  updatePermissions(workspaceId:Types.ObjectId,userId:Types.ObjectId,permission:string):Promise<void>
  findPermisssion(workspaceId:Types.ObjectId,userId:Types.ObjectId):Promise<string>
updateUserDataInWorkspace(workspaceId:Types.ObjectId,userId:Types.ObjectId,data:UserInWorkspaceDTO):Promise<void>
 paginationUserInWorkspace(
  workspaceId: string | Types.ObjectId,
  page: number,
  limit: number,
  skip: number,
  projectId: string | null
): Promise<{ items: UserDoument[] | null; totalItems: number }>
findUserStatusInWorkspace(userId:Types.ObjectId,workspaceId:Types.ObjectId):Promise<UserInWorkspaceDTO|null>

}
