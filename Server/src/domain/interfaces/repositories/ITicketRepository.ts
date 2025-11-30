import { Message } from "../../../types/tiketTypes";
import { Ticket } from "../../entities/Ticket";
import { IBaseRepository } from "./IBaseReposiory";
import { Types } from "mongoose";
export interface ITicketRepository extends IBaseRepository <Ticket> {
getMyTickets(workspaceId:Types.ObjectId):Promise<Ticket[]>
updateMsg(ticketId:Types.ObjectId,msg:Message):Promise<void>
}