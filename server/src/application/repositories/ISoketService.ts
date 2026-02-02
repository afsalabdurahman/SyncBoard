import {Chat} from "../../domain/entities/Chat"
// import {MessageDTO} from "../../presentation/dots/chatDTO/requestDTO"
import { MessageDto } from "../dto/SuperDTO"
export interface ISoketService {
    broadcastMessage(messageDTO:MessageDto):Promise<void>
}