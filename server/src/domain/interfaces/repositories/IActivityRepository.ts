import  { Types } from "mongoose";
import { Activities } from "../../entities/Activities";
import { ActivitiesResponseDTO } from "../../../application/dto/ActivityDTO";

export interface IActivityRepository{
createActivity(data:Activities):Promise<void>
allActivitiesInWorkspace(workspaceId:Types.ObjectId):Promise<ActivitiesResponseDTO[]|null>
}