import { inject, injectable } from "tsyringe";
import { ITicketUsecase } from "../../../application/repositories/ITicket";
import { HttpStatusCode } from "../../../common/errorCodes";
import { Request,Response,NextFunction } from "express";
import { ResponseMessages } from "../../../common/erroResponse";
import { ticketRequestDTO } from "../../../application/dto/TiketDTO";
import { TicketStatus } from "../../../types/tiketTypes";

@injectable()
export class TicketController {
constructor(
    @inject("TicketUsecase")private _ticketUsecases:ITicketUsecase
){}
async createTicket(req:Request,res:Response,next:NextFunction):Promise<void>{
try {
    console.log(req.body,"body")
    const input = req.body as ticketRequestDTO
    await this._ticketUsecases.execute(input)
// console.log(req.user,"user")
res.status(HttpStatusCode.CREATED).json({message:ResponseMessages.CREATED})
} catch (error) {
    console.log(error,"eroor")
    next(error)
}


}
async findMyTickets(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const workspaceId = req.params.workspaceid;
        const responseDTO=await this._ticketUsecases.getMyTickets(workspaceId)
        res.status(HttpStatusCode.OK).json(responseDTO)
    } catch (error) {
        console.log(error)
        next(error)
    }
}
async updateTicketMsg(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        console.log(req.body,req.params.id,"6666666666")
        const msg = req.body;
        const ticketId=req.params.id;
        await this._ticketUsecases.updateMsgs(ticketId,msg)
        res.status(HttpStatusCode.OK).json({message:ResponseMessages.SUCCESS})
    } catch (error) {
        console.log(error)
        next(error)
    }
}
async updateTicketStatus(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        console.log(req.query,req.params,"%%%%%%6666")
        const status=req.query.status as TicketStatus
        console.log(status,"stfdj")
        const ticketId=req.params.id
        await this._ticketUsecases.updateTicketStatus(ticketId,status)
        res.status(HttpStatusCode.OK).json({message:ResponseMessages.SUCCESS})
    } catch (error) {
        console.log(error,"WERERERRR")
    }
}

}