import mongoose, { Date, Types } from "mongoose";
import { User } from "../../entities/User";
import { ObjectId } from "mongoose";
import {IBaseRepository} from "./IBaseReposiory"
import { UserDoument } from "../../../infrastructure/database/models/UserModel";
export interface IUserRepository extends IBaseRepository<User|null>  {
  
  findByEmail(email: string): Promise<any | null>;

  findById(id: string | Types.ObjectId): Promise<User>;
  updateUser(
    id: any,
    updateFieldname: string,
    value: string
  ): Promise<User | any>;
  updateProfile(userId: string, merge: any): Promise<User | any>;
  changePassword(userId: string, newPassword: string): Promise<boolean>;
  addToWorkspace(
    userId: string | ObjectId,
    workspaceId: string |ObjectId,
    role: string,
    joinDate?: Date
  ): Promise<User|null>;
  findUsersInsameWorkspace(worspaceId: any): Promise<any>;
  updateOnlineStatus(userId: string): Promise<void>;
  countUser():Promise<any>
  paginationUser(workspaceId:string|ObjectId,page:number,limit:number,skip:number):Promise<{items:UserDoument[]|null,totalItems:number}>
  changeOnlineStatus(userId:Types.ObjectId):Promise<boolean>
}
