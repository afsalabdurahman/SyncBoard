import { Chat } from "../../entities/Chat";
import { Types } from "mongoose";
import { User } from "../../entities/User";
import { ChatMessage } from "../../../application/dto/ChatDTOs";
export interface IChatRepository{
  findAllChats(workapaceid:Types.ObjectId):Promise<ChatMessage[]>
  saveChats(message:Chat):Promise<void>;
  Onlinestatus(worksoaceid:Types.ObjectId):Promise<User[]>  
}