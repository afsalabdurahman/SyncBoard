import { ObjectId } from "mongoose"
import {Subscription} from "../../entities/Suscription"
import { SubscriptionDocument } from "../../../infrastructure/database/models/SuscriptionModel";
export interface ISuscription {
    create (data:Subscription):Promise<Subscription>
    findSuscriptionByUserId(customerId:string):Promise<Subscription|null>;
    updateSuscriptionPlan(userId:string,plankey:string,status:string):Promise<Subscription|null>
}