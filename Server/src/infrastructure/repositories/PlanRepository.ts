import mongoose from "mongoose";
import { Plan } from "../../domain/entities/Plan";
import {IPlanRepository} from "../../domain/interfaces/repositories/IPlanRepository"
import { injectable } from "tsyringe";
import {PlanModel} from "../database/models/PlanModel"

@injectable()
export class PlanRepository implements IPlanRepository {

  async  findByKey(key: string): Promise<any | null> {
    console.log(key,"my keyyy")
        const planKey=await PlanModel.findOne({key:key})
        return planKey
    }
}