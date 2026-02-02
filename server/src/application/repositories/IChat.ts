import { Chat } from "../../domain/entities/Chat"
import { User } from "../../domain/entities/User"
import {ChatMessage, ChatRequestDTO} from"../dto/ChatDTOs"
export interface IChatUsecase {
    sendMessage(dto:ChatRequestDTO):Promise<void>
    history(workapaceid:string):Promise<ChatMessage[]>
    findUserSatatus(workapaceid:string):Promise<User[]>
}