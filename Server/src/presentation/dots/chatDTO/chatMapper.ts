import {MessageDTO} from "./requestDTO"
import {Chat} from "../../../domain/entities/Chat"
import { NotFoundError } from "../../../utils/errors";
export class MessageMapper {
  static toDTO(message: Chat): MessageDTO {
    return new MessageDTO(
     
      message.content,
      message.senderName,
      message.timestamp?.toISOString()
    );
  }

  static toEntity(dto: MessageDTO): Chat {
    if(!dto.content||!dto.senderName) throw new NotFoundError("DTO not found")
    return new Chat(
   dto.senderName,
      dto.content,
    );
  }
}