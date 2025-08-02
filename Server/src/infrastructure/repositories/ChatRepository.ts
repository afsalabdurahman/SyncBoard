import { injectable } from "tsyringe";
import { ChatMessageModel } from "../database/models/ChatMessageModel";
import { Chat } from "../../domain/entities/Chat";
import { IChatRepository } from "../../domain/interfaces/repositories/IChatRepository";
import { UserModel } from "../database/models/UserModel";

@injectable()
export class ChatRepository implements IChatRepository {
  constructor() {}
  async saveChats(message: Chat): Promise<void> {
    console.log(message, "@@meg from reposiriot");

    const responseDb = await ChatMessageModel.create(message);
    console.log(responseDb, "dab repsosnes");
  }
  async findAllChats(): Promise<any> {
    const chats = await ChatMessageModel.find();
    return chats;
  }
  async Onlinestatus(): Promise<any> {
    const users = await UserModel.find({ isOnline: true }, { name: 1, _id: 0 });
    return users
  }
}
