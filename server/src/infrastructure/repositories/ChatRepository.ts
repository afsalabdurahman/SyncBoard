import { injectable } from "tsyringe";
import { ChatMessageModel } from "../database/models/ChatMessageModel";
import { Chat } from "../../domain/entities/Chat";
import { IChatRepository } from "../../domain/interfaces/repositories/IChatRepository";
import { UserModel } from "../database/models/UserModel";
import { Types } from "mongoose";
import { User } from "../../domain/entities/User";
import { ChatMessage } from "../../application/dto/ChatDTOs";

@injectable()
export class ChatRepository implements IChatRepository {
  constructor() {}
  async saveChats(message: Chat): Promise<void> {

    const responseDb = await ChatMessageModel.create(message);

  }
async findAllChats(
  workspaceId: Types.ObjectId
): Promise<ChatMessage[]> {
  const chats = await ChatMessageModel
    .find({ workspaceId })
    .lean<ChatMessage[]>();

  return chats;
}

  async Onlinestatus(worksoaceid:Types.ObjectId): Promise<User[]> {
   const users = await UserModel.find(
    {
      "workspace.workspaceId": worksoaceid,
      isOnline: true,
      isSuperAdmin: { $ne: true }
    },
    {
      name: 1,
      _id: 0
    }
  );
    return users as User[]
  }
}
