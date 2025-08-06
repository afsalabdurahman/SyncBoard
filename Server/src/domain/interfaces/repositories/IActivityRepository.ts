import mongoose from "mongoose";
import { Activities } from "../../entities/Activities";

export interface IActivityRepository{
createActivity(data:any):Promise<Activities|null>
findActivities(logId:mongoose.Types.ObjectId):Promise<any>;
addNewProject(projectName:string,creatdBy:string,activityId:string):Promise<any>
inviteMember(userName:string,activityId:string):Promise<any>
}