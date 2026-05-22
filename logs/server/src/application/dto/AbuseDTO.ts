import { Abuse } from "../../domain/entities/Abuse";

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
export interface ReportDto {
  id: string;
  type: string;
  description: string;
  severity: string;
  status: string;
  userId: string;
  userName: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

 export interface GetAllReportsResponseDto {
  count: number;
  reports: ReportDto[];
}
export interface listOfAbsuseReposnseDTO  {
      id:string;
      type: string,
      severity: string,
      status: string,
      createdAt: string,
}
 export interface listResponseDto {
  count: number;
  list: Abuse[];
  
}




