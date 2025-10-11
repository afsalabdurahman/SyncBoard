import { inject, injectable } from "tsyringe";
import { IChatUsecase } from "../../../application/repositories/IChat";
import { dot } from "node:test/reporters";

import { timeStamp } from "console";

import { NextFunction,Request,Response } from "express";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ChatRequestDTO } from "../../../application/dto/ChatDTOs";

//import {SoketSerive} from "../../../infrastructure/services/SocketService"

@injectable()
export class ChatController{
    constructor(@inject("ChatUseCase")private _chatuseCase:IChatUsecase){}
   
async saveMessage(message:ChatRequestDTO):Promise<void>{


await this._chatuseCase.sendMessage(message)
}
async chatHistor(req:Request,res:Response,next:NextFunction):Promise<void>{
const historyData=await this._chatuseCase.history()

res.status(HttpStatusCode.OK).json(historyData)
}

async findOnlineStatus(req:Request,res:Response,next:NextFunction):Promise<void>{

    const users=await this._chatuseCase.findUserSatatus()
    res.status(HttpStatusCode.OK).json(users)
}


}