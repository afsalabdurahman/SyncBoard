import mongoose, { ObjectId } from "mongoose";
import { Subscription } from "../../domain/entities/Suscription";
import { ISuscription } from "../../domain/interfaces/repositories/ISuscriptionRepository";
import { SubscriptionDocument,SubscriptionModel } from "../database/models/SuscriptionModel";

export class SuscriptionRepository implements ISuscription {

async create(entity: Subscription): Promise<SubscriptionDocument> {
   const created= await SubscriptionModel.create(entity);
 
    return created
}
async findSuscriptionByUserId(customerId:string|ObjectId):Promise<SubscriptionDocument|null>{
  
    const suscription=await SubscriptionModel.findOne({user:customerId})
 
    return suscription ;
}
async updateSuscriptionPlan(userId: string , plankey: string, status: string): Promise<SubscriptionDocument|null> {
  
  const updatedSubscription = await SubscriptionModel.findOneAndUpdate(
      { user: userId },
      { $set: { planKey:plankey, status } },
      { new: true } 
    );
    return updatedSubscription
}
}