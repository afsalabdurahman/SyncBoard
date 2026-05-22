import mongoose from "mongoose";
import { Plan } from "../../domain/entities/Plan";
import {IPlanRepository} from "../../domain/interfaces/repositories/IPlanRepository"
import { injectable } from "tsyringe";
import {PlanModel} from "../database/models/PlanModel"
import { NotFoundError } from "../../utils/errors";

@injectable()
export class PlanRepository implements IPlanRepository {

  async  findByKey(key: string): Promise<Plan | null> {
  
        const planKey=await PlanModel.findOne({key:key}).lean();
       if(!planKey) return null
        const myPlan=new Plan(planKey?._id.toString(),planKey?.key,planKey?.name,planKey?.priceCents,planKey?.billingInterval,planKey?.features,planKey?.stripePriceId,planKey?.description,planKey.status,planKey.stripeProductId)
        return myPlan
    }
    async removePlan(id: mongoose.Types.ObjectId): Promise<void> {
         const plan = await PlanModel.findById(id);
           if (!plan) {
        throw new NotFoundError("Plan not found");
    }
      const newStatus = plan.status === "Active" ? "Inactive" : "Active";

   await PlanModel.findByIdAndUpdate(id, {
        $set: { status: newStatus }
    });
    }
   async deletePlan(id: mongoose.Types.ObjectId): Promise<void> {
      await PlanModel.deleteOne({_id:id})
    }
  async  findActivePlans(): Promise<Plan[]> {
      const plan = await PlanModel.find({status:"Active"}).lean().exec();
      return plan as unknown as Plan[]
    }
    
}