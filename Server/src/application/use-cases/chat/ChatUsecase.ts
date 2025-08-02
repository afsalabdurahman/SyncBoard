import { injectable, inject } from "tsyringe";
import { IChatRepository } from "../../../domain/interfaces/repositories/IChatRepository";
import { MessageDTO } from "../../../presentation/dots/chatDTO/requestDTO";
import { MessageMapper } from "../../../presentation/dots/chatDTO/chatMapper";
import { IChatUsecase } from "../../repositories/IChat";
import { ISoketService } from "../../repositories/ISoketService";
import { Chat } from "../../../domain/entities/Chat";
@injectable()
export class ChatUsecase implements IChatUsecase {
  constructor(
    @inject("ChatRepository") private chatRepository: IChatRepository,
    // @inject("SoketSerive") private socketService: ISoketService
  ) {}
  async sendMessage(dto: any): Promise<void> {
  
   const data={content:dto.content,senderName:dto.sender}
    const message: Chat = MessageMapper.toEntity(data);
   
    await this.chatRepository.saveChats(message);
     const messageDTO = MessageMapper.toDTO(message);
      // this.socketService.broadcastMessage(messageDTO);
  }
   async history(): Promise<any> {
     const chats=await this.chatRepository.findAllChats() 
     return chats
   }
  async findUserSatatus(): Promise<any> {
     const users = await this.chatRepository.Onlinestatus()
     return users
   }

}
