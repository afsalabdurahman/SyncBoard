import {Chat} from "../../domain/entities/Chat"
import {MessageDTO} from "../../presentation/dots/chatDTO/requestDTO"
export interface ISoketService {
    broadcastMessage(messageDTO:MessageDTO):Promise<void>
}