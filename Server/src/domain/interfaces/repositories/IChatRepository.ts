import { Chat } from "../../entities/Chat";

export interface IChatRepository{
  findAllChats():Promise<any>
  saveChats(message:Chat):Promise<void>  
}