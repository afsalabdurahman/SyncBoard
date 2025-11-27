import { Types } from "mongoose";
import { approvalType } from "./Task";
export class Abuse {
  description: string;
  otherType?: string;  
  severity: string;
  type: string;
  userId:string|Types.ObjectId;
 workspaceId:string|Types.ObjectId;
 status:approvalType;
  constructor(params: {
    description: string;
    otherType?: string;
   
    severity: string;
    type: string;
    userId:string|Types.ObjectId;
      workspaceId:string|Types.ObjectId
      status:approvalType
  }) {
    this.description = params.description;
    this.otherType = params.otherType;
    this.severity = params.severity;
    this.type = params.type;
    this.userId = params.userId
    this.workspaceId=params.workspaceId
    this.status=params.status
  }
}
