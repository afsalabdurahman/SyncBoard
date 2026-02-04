<<<<<<< HEAD
import { Abuse } from "../../domain/entities/Abuse";
=======
>>>>>>> fix/eslint
import { AbuseRequestDTO, GetAllReportsResponseDto, listOfAbsuseReposnseDTO, UpdateAbuseStatusDTO } from "../dto/AbuseDTO";

export interface IAbuseUsecase{
    execute(input:AbuseRequestDTO,userId:string,workspaceId:string):Promise<string>
    findAbuseReports(page:number,limit:number,skip:number):Promise<GetAllReportsResponseDto>
    updateStatus(input:UpdateAbuseStatusDTO,reportId:string):Promise<void>;
    listOfReports(page:number,limit:number,skip:number,userid:string,workspaceid:string):Promise<{
      mappedReponse: listOfAbsuseReposnseDTO[];
      docsize: number;
    }>
    searchReport(query:string,workspaceid:string,userid:string):Promise<listOfAbsuseReposnseDTO[]>
}