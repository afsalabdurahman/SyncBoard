import { Types } from "mongoose";
export class Abuse {
  description: string;
  otherType?: string;
  
  severity: string;
  type: string;
  userId:string|Types.ObjectId;

  constructor(params: {
    description: string;
    otherType?: string;
   
    severity: string;
    type: string;
    userId:string|Types.ObjectId
  }) {
    this.description = params.description;
    this.otherType = params.otherType;
    this.severity = params.severity;
    this.type = params.type;
    this.userId = params.userId
  }
}
