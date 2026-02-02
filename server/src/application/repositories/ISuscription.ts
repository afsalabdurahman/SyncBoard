import { Subscription } from "../../domain/entities/Suscription";

export interface ISuscriptionUsecase{
getSuscription(customerId:string):Promise <Subscription>
updateSuscriptionPlan(userId:string,planName:string,status:string):Promise<Subscription|null>
sendReceipt(name:string,email:String,link:string):Promise<void>
}