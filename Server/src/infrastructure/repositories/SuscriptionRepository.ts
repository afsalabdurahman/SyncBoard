import mongoose, { ObjectId } from "mongoose";
import { Subscription } from "../../domain/entities/Suscription";
import { ISuscription } from "../../domain/interfaces/repositories/ISuscriptionRepository";
import { SubscriptionDocument,SubscriptionModel } from "../database/models/SuscriptionModel";

export class SuscriptionRepository implements ISuscription {

async create(entity: Subscription): Promise<Subscription> {
   const created= await SubscriptionModel.create(entity)
 
    return created.toObject() as Subscription;
}
async findSuscriptionByUserId(customerId:string|ObjectId):Promise<Subscription|null>{
  
    const suscription=await SubscriptionModel.findOne({user:customerId})
 
    return suscription as Subscription ;
}
async updateSuscriptionPlan(userId: string , plankey: string, status: string): Promise<Subscription|null> {
  
  const updatedSubscription = await SubscriptionModel.findOneAndUpdate(
      { user: userId },
      { $set: { planKey:plankey, status } },
      { new: true } 
    );
    return updatedSubscription ? updatedSubscription.toObject() as Subscription : null;
}
}