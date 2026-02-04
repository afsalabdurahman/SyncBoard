import {Plan} from "../../entities/Plan"
export interface IPlanRepository{
findByKey(key: string): Promise<Plan | null>;
}