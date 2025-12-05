
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



