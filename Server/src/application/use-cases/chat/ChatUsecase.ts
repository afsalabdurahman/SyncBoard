import { injectable, inject } from "tsyringe";
import { IChatRepository } from "../../../domain/interfaces/repositories/IChatRepository";
import { IChatUsecase } from "../../repositories/IChat";
import { ChatMapper } from "../../mappers/ChatMapper";
import { User } from "../../../domain/entities/User";
import { ChatMessage, ChatRequestDTO } from "../../dto/ChatDTOs";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
@injectable()
export class ChatUsecase implements IChatUsecase {
  constructor(
    @inject("ChatRepository") private _chatRepository: IChatRepository,

  ) { }
  async sendMessage(dto: ChatRequestDTO): Promise<void> {
    const messageEntity = ChatMapper.chatToEntity(dto)
    await this._chatRepository.saveChats(messageEntity);

  }
  async history(workspaceid: string): Promise<ChatMessage[]> {
    const chats = await this._chatRepository.findAllChats(stringToMongoObj(workspaceid));

    return chats
  }
  async findUserSatatus(worksoaceid: string): Promise<User[]> {
    const users = await this._chatRepository.Onlinestatus(stringToMongoObj(worksoaceid))
    return users
  }

}
