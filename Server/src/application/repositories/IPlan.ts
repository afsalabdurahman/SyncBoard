import { Plan } from "../../domain/entities/Plan"
export interface IPlanUsecase{
excute(planKey:string):Promise<any>
}