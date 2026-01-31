import { Types } from "mongoose";
import { ActivityLogMessage, ActivityTypes } from "../../types/activityTypes";

export interface ActivitiesReqestDTO {
  workspaceId: Types.ObjectId | string;
   activityType: ActivityTypes;
   logMsg: ActivityLogMessage;
   createdBy: string;      
  
}
export interface ActivitiesResponseDTO {
  
        activityType: ActivityTypes,
        logMsg: ActivityLogMessage,
        createdAt: string | Date,
        userName: string
    
}
export interface ActivityResponseMessage{
  message:[]
}
