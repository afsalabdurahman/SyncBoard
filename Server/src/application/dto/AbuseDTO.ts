import { stringToMongoObj } from "../../utils/convertMongoObject";

export interface AbuseRequestDTO{
     description: string;
      otherType?: string;
      severity: string;
      type: string;
    
}
export interface UpdateAbuseStatusDTO{
      userId:string,
      workspaceId:string,
      description:string,
      status:string
}


