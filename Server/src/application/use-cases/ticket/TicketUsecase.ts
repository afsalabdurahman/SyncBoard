import { inject, injectable } from "tsyringe";
import { ticketRequestDTO } from "../../dto/TiketDTO";
import { ITicketUsecase } from "../../repositories/ITicket";
import { TicketMapper } from "../../mappers/TicketMapper";
import { ValidationError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { Ticket } from "../../../domain/entities/Ticket";
import { ITicketRepository } from "../../../domain/interfaces/repositories/ITicketRepository";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
import { Message } from "../../../types/tiketTypes";
@injectable()
export class TicketUsecase implements ITicketUsecase{
    constructor(@inject("TicketRepository")private _ticketRepository:ITicketRepository ){}
    async execute(input: ticketRequestDTO): Promise<void> {
        console.log(input.id,"idd")
        const isValid=TicketMapper.validateTicket(input);
        console.log(isValid.error,"validyut")
         if (!isValid.success) throw new ValidationError(ResponseMessages.INVALID_INPUT);
         const TicketEntity= TicketMapper.ticketToEntity(input)
       const savedDoc= await this._ticketRepository.create(TicketEntity)
        console.log(savedDoc,"SavedDocu")
       
    }
    async getMyTickets(workspaceId:string): Promise<Ticket[]> {
       const myTikets =await this._ticketRepository.getMyTickets(stringToMongoObj(workspaceId))
       return myTikets
    }
    async updateMsgs(ticketId: string, msg: Message): Promise<void> {
        console.log(ticketId,"id",msg)
        await this._ticketRepository.updateMsg(stringToMongoObj(ticketId),msg)
        
    }
   
}