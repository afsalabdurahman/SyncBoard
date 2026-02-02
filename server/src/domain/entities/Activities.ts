import { Types } from "mongoose";
import { ActivityLogMessage, ActivityTypes } from "../../types/activityTypes";


export class Activities {
  workspaceId: Types.ObjectId|string;
  activityType: ActivityTypes;
   logMsg:ActivityLogMessage;
   createdBy: Types.ObjectId | string;

constructor(params:{workspaceId:Types.ObjectId|string,activityType:ActivityTypes,logMsg:ActivityLogMessage,createdby:Types.ObjectId|string}){
  this.workspaceId=params.workspaceId,
  this.activityType=params.activityType,
  this.logMsg=params.logMsg,
  this.createdBy=params.createdby
}
  
}
 