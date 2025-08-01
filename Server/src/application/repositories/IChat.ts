import {MessageDTO} from"../../presentation/dots/chatDTO/requestDTO"
export interface IChatUsecase {
    sendMessage(dto:MessageDTO):Promise<void>
    history():Promise<any>
}