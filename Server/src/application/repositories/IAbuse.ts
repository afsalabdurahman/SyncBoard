import { Abuse } from "../../domain/entities/Abuse";
import { AbuseRequestDTO, GetAllReportsResponseDto, UpdateAbuseStatusDTO } from "../dto/AbuseDTO";

export interface IAbuseUsecase{
    execute(input:AbuseRequestDTO,userId:string,workspaceId:string):Promise<string>
    findAbuseReports(page:number,limit:number,skip:number):Promise<GetAllReportsResponseDto>
    updateStatus(input:UpdateAbuseStatusDTO,reportId:string):Promise<void>
}