import { Chat } from "../../domain/entities/Chat";
import { ChatRequestDTO } from "../dto/ChatDTOs";

export class ChatMapper {
 static chatToEntity(dto:ChatRequestDTO):Chat{
       return new Chat(
      dto.sender,
      dto.content,
      dto.workspaceId,
      dto.userId,
      dto.attachments

   
   
    );
 }

}