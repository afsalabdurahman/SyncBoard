import { Types } from "mongoose";
import { Subscription } from "../../domain/entities/Suscription";

export interface ISuscriptionUsecase{
getSuscription(customerId:string):Promise <Subscription>
updateSuscriptionPlan(userId:string,planName:string,status:string):Promise<Subscription|null>
sendReceipt(name:string,email:string,link:string):Promise<void>;
 updateHistory(userId:string,   id:string,date:Date,amount:number,status:string):Promise<void>

}