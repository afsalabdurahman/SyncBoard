import { Chat } from "../../domain/entities/Chat"
import { User } from "../../domain/entities/User"
import {ChatRequestDTO} from"../dto/ChatDTOs"
export interface IChatUsecase {
    sendMessage(dto:ChatRequestDTO):Promise<void>
    history(workapaceid:string):Promise<Chat[]>
    findUserSatatus(workapaceid:string):Promise<User[]>
}