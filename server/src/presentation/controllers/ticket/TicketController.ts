import { inject, injectable } from "tsyringe";
import { ITicketUsecase } from "../../../application/repositories/ITicket";
import { HttpStatusCode } from "../../../common/errorCodes";
import { Request,Response } from "express";
import { ResponseMessages } from "../../../common/erroResponse";
import { ticketRequestDTO } from "../../../application/dto/TiketDTO";
import { TicketStatus } from "../../../types/tiketTypes";

@injectable()
export class TicketController {
constructor(
    @inject("TicketUsecase")private _ticketUsecases:ITicketUsecase
){}
async createTicket(req:Request,res:Response):Promise<void>{
        console.log(req.body,"BU))))")
    const input = req.body as ticketRequestDTO
    await this._ticketUsecases.execute(input)
res.status(HttpStatusCode.CREATED).json({message:ResponseMessages.CREATED})



}
async findMyTickets(req:Request,res:Response):Promise<void>{
   
        const workspaceId = req.params.workspaceId as string
        const responseDTO=await this._ticketUsecases.getMyTickets(workspaceId)
        res.status(HttpStatusCode.OK).json(responseDTO)
   
}
async updateTicketMsg(req:Request,res:Response,):Promise<void>{
    
        const msg = req.body;
        const ticketId=req.params.id as string
        await this._ticketUsecases.updateMsgs(ticketId,msg)
        res.status(HttpStatusCode.OK).json({message:ResponseMessages.SUCCESS})
   
}
async updateTicketStatus(req:Request,res:Response):Promise<void>{
    
        const status=req.query.status as TicketStatus
        const ticketId=req.params.id as string
        await this._ticketUsecases.updateTicketStatus(ticketId,status)
        res.status(HttpStatusCode.OK).json({message:ResponseMessages.SUCCESS})
    
}

}