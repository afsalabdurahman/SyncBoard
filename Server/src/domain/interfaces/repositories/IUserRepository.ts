import { Date } from "mongoose";
import {User} from "../../entities/User"
import { ObjectId } from "mongoose";
export interface IUserRepository {
  findByEmail(email: string): Promise<any | null>;
  create(entity: User): Promise<User|any>;
  findById(id:string):Promise<User>;
  updateUser(id:any,updateFieldname:string,value:string):Promise<User|any>;
  updateProfile(userId:string,merge:any):Promise<User | any>;
  changePassword(userId:string,newPassword:string):Promise<boolean>;
  addToWorkspace(userId:any,workspaceId:any,role:string,joinDate?:Date):Promise<any>;
findUsersInsameWorkspace(worspaceId:any):Promise<any>;
updateOnlineStatus(userId:string):Promise<void>;
}