import { Date, Types } from "mongoose";
import { User } from "../../entities/User";
import { ObjectId } from "mongoose";
import { IBaseRepository } from "./IBaseReposiory"
import { UserDoument } from "../../../infrastructure/database/models/UserModel";
import { UserResponseDTO } from "../../../application/dto/SuperDTO";
export interface IUserRepository extends IBaseRepository<User | null> {

  findByEmail(email: string): Promise<User | null>;

  findById(id: string | Types.ObjectId): Promise<User | null>;
  findUser(id: string | Types.ObjectId): Promise<User | null>;
  updateUser(
    id: string | Types.ObjectId,
    updateFieldname: string,
    value: string
  ): Promise<User | null>;
  updateProfile(userId: string,  merge: { profileData: Record<string, string> }): Promise<User | null>;
  changePassword(userId: string, newPassword: string): Promise<boolean>;
  addToWorkspace(
    userId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<User | null>;
  userVerified(userId:Types.ObjectId,isVerified:boolean,verificationExpiresAt:Date|null):Promise<User|null>
  findUsersInsameWorkspace(worspaceId: Types.ObjectId): Promise<User[] | null>;
  updateOnlineStatus(userId: string): Promise<void>;
  countUser(): Promise<number | Types.ObjectId>
  paginationUser(workspaceId: string | ObjectId, page: number, limit: number, skip: number,projectId:string|null): Promise<{ items: UserDoument[] | null, totalItems: number }>
  changeOnlineStatus(userId: Types.ObjectId): Promise<boolean>;
   searchUser(workspaceId:Types.ObjectId,query:string):Promise<UserResponseDTO[]>
   deleteuserById(userId:Types.ObjectId):Promise<void>
}
