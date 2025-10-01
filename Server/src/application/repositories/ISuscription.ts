import { Subscription } from "../../domain/entities/Suscription"
export interface ISuscriptionUsecase{
excute(userId:string,planKey:string, paymentMethodId:string, quantity :number,myplan?:string):Promise<any>
getSuscription(customerId:string):Promise <any>
}