import { Ticket } from "../../domain/entities/Ticket";
import { Message } from "../../types/tiketTypes";
import { ticketRequestDTO } from "../dto/TiketDTO";

export interface ITicketUsecase{
execute(input:ticketRequestDTO):Promise<void>
getMyTickets(workspaceId:string):Promise<Ticket[]>
updateMsgs(ticketId:string,msg:Message):Promise<void>
}