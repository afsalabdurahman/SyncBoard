import { MessageDto } from "../dto/SuperDTO"
export interface ISoketService {
    broadcastMessage(messageDTO:MessageDto):Promise<void>
}