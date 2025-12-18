import { SubscriptionDocument } from "../../infrastructure/database/models/SuscriptionModel";

export interface ISuscriptionUsecase{
// excute(userId:string,planKey:string, paymentMethodId:string, quantity :number,myplan?:string):Promise<any>
getSuscription(customerId:string):Promise <SubscriptionDocument>
}