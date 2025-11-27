import { Abuse } from "../../domain/entities/Abuse";
import { AbuseRequestDTO, UpdateAbuseStatus } from "../dto/AbuseDTO";

export interface IAbuseUsecase{
    execute(input:AbuseRequestDTO,userId:string,workspaceId:string):Promise<string>
    findAbuseReports(page:number,limit:number,skip:number):Promise<any>
    updateStatus(input:UpdateAbuseStatus,reportId:string):Promise<void>
}