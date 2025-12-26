import { Subscription } from "../../domain/entities/Suscription";
import { SubscriptionDocument } from "../../infrastructure/database/models/SuscriptionModel";

export interface ISuscriptionUsecase{
// excute(userId:string,planKey:string, paymentMethodId:string, quantity :number,myplan?:string):Promise<any>
getSuscription(customerId:string):Promise <Subscription>
updateSuscriptionPlan(userId:string,planName:string,status:string):Promise<Subscription|null>
sendReceipt(name:string,email:String,link:string):Promise<void>
}