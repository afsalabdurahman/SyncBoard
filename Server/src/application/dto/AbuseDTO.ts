import { Types } from "mongoose";

export interface AbuseRequestDTO{
     description: string;
      otherType?: string;
      severity: string;
      type: string;
      // user:any|Types.ObjectId;
    
}
