import { inject, injectable } from "tsyringe";
import { IPlanUsecase } from "../../../repositories/IPlan";
import { IPlanRepository } from "../../../../domain/interfaces/repositories/IPlanRepository";
@injectable()
export class PlanUsecase implements IPlanUsecase {
constructor(@inject ('PlanRepository')private planRepository:IPlanRepository ){}


async excute(planKey: string): Promise<any> {
    const myKey = await this.planRepository.findByKey(planKey)
    return myKey
}

}