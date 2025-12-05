import { injectable, inject } from "tsyringe";
import { IChatRepository } from "../../../domain/interfaces/repositories/IChatRepository";
import { IChatUsecase } from "../../repositories/IChat";
import { ChatMapper } from "../../mappers/ChatMapper";
import { Chat } from "../../../domain/entities/Chat";
import { User } from "../../../domain/entities/User";
import { ChatRequestDTO } from "../../dto/ChatDTOs";
@injectable()
export class ChatUsecase implements IChatUsecase {
  constructor(
    @inject("ChatRepository") private _chatRepository: IChatRepository,
   
  ) {}
  async sendMessage(dto: ChatRequestDTO): Promise<void> {
  const data={content:dto.content,senderName:dto.sender}
  const messageEntity= ChatMapper.chatToEntity(dto)
   await this._chatRepository.saveChats(messageEntity);
    
  }
   async history(): Promise<Chat[]> {
     const chats=await this._chatRepository.findAllChats() 
     return chats as Chat[]
   }
  async findUserSatatus(): Promise<User> {
     const users = await this._chatRepository.Onlinestatus()
     return users
   }

}
