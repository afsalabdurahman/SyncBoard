import { inject, injectable } from "tsyringe";
import { IChatUsecase } from "../../../application/repositories/IChat";


import { NextFunction,Request,Response } from "express";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ChatRequestDTO } from "../../../application/dto/ChatDTOs";


@injectable()
export class ChatController{
    constructor(@inject("ChatUseCase")private _chatuseCase:IChatUsecase){}
   
async saveMessage(message:ChatRequestDTO):Promise<void>{
await this._chatuseCase.sendMessage(message)
}
async chatHistory(req:Request,res:Response,next:NextFunction):Promise<void>{
    const workapaceid=req.params.workspaceid as string;
const historyData=await this._chatuseCase.history(workapaceid)
res.status(HttpStatusCode.OK).json(historyData)
}

async findOnlineStatus(req:Request,res:Response,next:NextFunction):Promise<void>{
     const workapaceid=req.params.workspaceid as string;
    const users=await this._chatuseCase.findUserSatatus(workapaceid)
    res.status(HttpStatusCode.OK).json(users)
}

}