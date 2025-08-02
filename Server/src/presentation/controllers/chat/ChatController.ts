import { inject, injectable } from "tsyringe";
import { IChatUsecase } from "../../../application/repositories/IChat";
import { dot } from "node:test/reporters";
import {MessageDTO} from "../../dots/chatDTO/requestDTO"
import { timeStamp } from "console";
import { MessageMapper } from "../../dots/chatDTO/chatMapper";
import { NextFunction,Request,Response } from "express";
import { HttpStatusCode } from "../../../common/errorCodes";

//import {SoketSerive} from "../../../infrastructure/services/SocketService"

@injectable()
export class ChatController{
    constructor(@inject("ChatUseCase")private chatuseCase:IChatUsecase){}
   
async saveMessage(message:any):Promise<void>{


await this.chatuseCase.sendMessage(message)
}
async chatHistor(req:Request,res:Response,next:NextFunction):Promise<void>{
const historyData=await this.chatuseCase.history()

res.status(HttpStatusCode.OK).json(historyData)
}

async findOnlineStatus(req:Request,res:Response,next:NextFunction):Promise<void>{

    const users=await this.chatuseCase.findUserSatatus()
    res.status(HttpStatusCode.OK).json(users)
}


}