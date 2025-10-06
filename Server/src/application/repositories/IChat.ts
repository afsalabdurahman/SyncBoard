import {ChatRequestDTO} from"../dto/ChatDTOs"
export interface IChatUsecase {
    sendMessage(dto:ChatRequestDTO):Promise<void>
    history():Promise<any>
    findUserSatatus():Promise<any>
}