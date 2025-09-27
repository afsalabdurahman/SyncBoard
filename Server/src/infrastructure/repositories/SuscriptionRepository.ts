import mongoose, { ObjectId } from "mongoose";
import { Subscription } from "../../domain/entities/Suscription";
import { ISuscription } from "../../domain/interfaces/repositories/ISuscriptionRepository";
import { ISubscription,SubscriptionModel } from "../database/models/SuscriptionModel";
export class SuscriptionRepository implements ISuscription {
async create(data: Subscription): Promise<any> {
    await SubscriptionModel.create(data)
    return true
}
async findSuscriptionByUserId(customerId:string|ObjectId):Promise<Subscription|any>{
    const suscription=await SubscriptionModel.find({user:customerId})
  
    return suscription ;
}
}