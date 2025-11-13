import { injectable, inject } from "tsyringe";
import { IChatRepository } from "../../../domain/interfaces/repositories/IChatRepository";

import { IChatUsecase } from "../../repositories/IChat";
import { ISoketService } from "../../repositories/ISoketService";
import { Chat } from "../../../domain/entities/Chat";
import { ChatMapper } from "../../mappers/ChatMapper";
@injectable()
export class ChatUsecase implements IChatUsecase {
  constructor(
    @inject("ChatRepository") private _chatRepository: IChatRepository,
   
  ) {}
  async sendMessage(dto: any): Promise<void> {
  
   const data={content:dto.content,senderName:dto.sender}
  const message= ChatMapper.chatToEntity(dto)


   
   await this._chatRepository.saveChats(message);
    //  const messageDTO = MessageMapper.toDTO(message);
      // this.socketService.broadcastMessage(messageDTO);
  }
   async history(): Promise<any> {
     const chats=await this._chatRepository.findAllChats() 
     return chats
   }
  async findUserSatatus(): Promise<any> {
     const users = await this._chatRepository.Onlinestatus()
     return users
   }

}
