import { Types } from "mongoose";
import { Invitation } from "../../entities/Invitation";
import { IBaseRepository } from "./IBaseReposiory";

export interface IinvitationRepository extends IBaseRepository <Invitation> {
findInvitaionLinkByEmail(email:string):Promise<Invitation|null>
updateStatus(workspaceId:Types.ObjectId,status:string,email:string):Promise<void>
}