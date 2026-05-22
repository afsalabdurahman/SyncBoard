import { Types } from "mongoose";
import {Plan} from "../../entities/Plan"
export interface IPlanRepository{
findByKey(key: string): Promise<Plan | null>;
removePlan(id:Types.ObjectId):Promise<void>;
deletePlan(id:Types.ObjectId):Promise<void>;
findActivePlans():Promise<Plan[]>
}