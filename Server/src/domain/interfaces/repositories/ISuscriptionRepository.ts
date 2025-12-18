import { ObjectId } from "mongoose"
import {Subscription} from "../../entities/Suscription"
import { SubscriptionDocument } from "../../../infrastructure/database/models/SuscriptionModel";
export interface ISuscription {
    create (data:Subscription):Promise<SubscriptionDocument>
    findSuscriptionByUserId(customerId:string):Promise<SubscriptionDocument|null>;
    updateSuscriptionPlan(userId:string,plankey:string,status:string):Promise<SubscriptionDocument|null>
}