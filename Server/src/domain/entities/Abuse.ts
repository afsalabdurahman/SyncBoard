import { Types } from "mongoose";
import {statusType,approvalType,priorityType} from "../../types/taskTypes"
export class Abuse {
  id?:Types.ObjectId | string;
  description: string;
  otherType?: string;  
  severity: string;
  type: string;
  userId:string|Types.ObjectId;
 workspaceId:string|Types.ObjectId;
 status:approvalType;
 createdAt? :Date
  constructor(params: {
    id?:Types.ObjectId |string;
    description: string;
    otherType?: string;
   
    severity: string;
    type: string;
    userId:string|Types.ObjectId;
      workspaceId:string|Types.ObjectId
      status:approvalType,
      createdAt?:Date
  }) {
    this.id=params.id;
    this.description = params.description;
    this.otherType = params.otherType;
    this.severity = params.severity;
    this.type = params.type;
    this.userId = params.userId
    this.workspaceId=params.workspaceId
    this.status=params.status;
    this.createdAt=params.createdAt
  }
}
