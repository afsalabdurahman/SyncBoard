import { ObjectId } from "mongoose"
import {Subscription} from "../../entities/Suscription"
export interface ISuscription {
    create (data:any):Promise<any>
    findSuscriptionByUserId(customerId:string|any):Promise<Subscription|null>;
    updateSuscriptionPlan(userId:string|any,plankey:string,status:string):Promise<Subscription>
}