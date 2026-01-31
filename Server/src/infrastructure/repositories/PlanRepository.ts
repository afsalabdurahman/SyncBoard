import mongoose from "mongoose";
import { Plan } from "../../domain/entities/Plan";
import {IPlanRepository} from "../../domain/interfaces/repositories/IPlanRepository"
import { injectable } from "tsyringe";
import {PlanDocument, PlanModel} from "../database/models/PlanModel"

@injectable()
export class PlanRepository implements IPlanRepository {

  async  findByKey(key: string): Promise<Plan | null> {
  
        const planKey=await PlanModel.findOne({key:key}).lean();
       if(!planKey) return null
        const myPlan=new Plan(planKey?._id.toString(),planKey?.key,planKey?.name,planKey?.priceCents,planKey?.billingInterval,planKey?.features,planKey?.stripePriceId,planKey?.description)
        return myPlan
    }
}