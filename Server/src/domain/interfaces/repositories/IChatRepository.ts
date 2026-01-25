import { Chat } from "../../entities/Chat";
import { Types } from "mongoose";
import { User } from "../../entities/User";
export interface IChatRepository{
  findAllChats(workapaceid:Types.ObjectId):Promise<any>
  saveChats(message:Chat):Promise<void>;
  Onlinestatus(worksoaceid:Types.ObjectId):Promise<User[]>  
}