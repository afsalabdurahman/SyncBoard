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
  updateProfile(userId: string, merge: Record<string, string>): Promise<User | null>;
  changePassword(userId: string, newPassword: string): Promise<boolean>;
  addToWorkspace(
    userId: string | ObjectId,
    workspaceId: string | ObjectId,
    role: string,
    joinDate?: Date
  ): Promise<User | null>;
  findUsersInsameWorkspace(worspaceId: Types.ObjectId): Promise<UserDoument[] | null>;
  updateOnlineStatus(userId: string): Promise<void>;
  countUser(): Promise<number | Types.ObjectId>
  paginationUser(workspaceId: string | ObjectId, page: number, limit: number, skip: number): Promise<{ items: UserDoument[] | null, totalItems: number }>
  changeOnlineStatus(userId: Types.ObjectId): Promise<boolean>;
   searchUser(workspaceId:Types.ObjectId,query:string):Promise<UserResponseDTO[]>
}
