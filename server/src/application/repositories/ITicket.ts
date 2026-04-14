import { TicketDocument } from "../../infrastructure/database/models/TicketModel";
import { Message, TicketStatus } from "../../types/tiketTypes";
import { ticketRequestDTO } from "../dto/TiketDTO";

export interface ITicketUsecase{
execute(input:ticketRequestDTO):Promise<void>
getMyTickets(workspaceId:string):Promise<TicketDocument[]>
updateMsgs(ticketId:string,msg:Message):Promise<void>
updateTicketStatus(ticketId:string,status:TicketStatus):Promise<boolean>

}