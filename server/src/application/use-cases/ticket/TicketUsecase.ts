import { inject, injectable } from "tsyringe";
import { ticketRequestDTO } from "../../dto/TiketDTO";
import { ITicketUsecase } from "../../repositories/ITicket";
import { TicketMapper } from "../../mappers/TicketMapper";
import { NotFoundError, ValidationError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { ITicketRepository } from "../../../domain/interfaces/repositories/ITicketRepository";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
import { Message } from "../../../types/tiketTypes";
import { TicketDocument } from "../../../infrastructure/database/models/TicketModel";
@injectable()
export class TicketUsecase implements ITicketUsecase{
    constructor(@inject("TicketRepository")private _ticketRepository:ITicketRepository ){}
    async execute(input: ticketRequestDTO): Promise<void> {
        const isValid=TicketMapper.validateTicket(input);
         if (!isValid.success) throw new ValidationError(ResponseMessages.INVALID_INPUT);
         const TicketEntity= TicketMapper.ticketToEntity(input)
        await this._ticketRepository.create(TicketEntity)
       
    }
    async getMyTickets(workspaceId:string): Promise<TicketDocument[]> {
       const myTikets =await this._ticketRepository.getMyTickets(stringToMongoObj(workspaceId))
       if(!myTikets) throw new NotFoundError(ResponseMessages.TASK_NOTFOUND)
       return myTikets
    }
    async updateMsgs(ticketId: string, msg: Message): Promise<void> {
        await this._ticketRepository.updateMsg(stringToMongoObj(ticketId),msg)
        
    }
   async updateTicketStatus(ticketId: string, status: "open" | "in_progress" | "resolved" | "reopened"): Promise<boolean> {
    await this._ticketRepository.updateTicketStatus(stringToMongoObj( ticketId),status)
       
       return true
   }
}