import { Types } from "mongoose";
import { Abuse } from "../../entities/Abuse";
import { IBaseRepository } from "./IBaseReposiory";
import { GetAllReportsResponseDto, listOfAbsuseReposnseDTO, listResponseDto } from "../../../application/dto/AbuseDTO";
import { ObjectId } from "mongodb";

export interface IAbuseRepository extends IBaseRepository <Abuse>{
    getAllReports(page:number,limit:number,skip:number,):Promise<GetAllReportsResponseDto>
    updateReport(id:Types.ObjectId|string,status:string):Promise<void>;
findListOfReports(
  page: number,
  limit: number,
  skip: number,
  userid: Types.ObjectId,
  workspaceid: Types.ObjectId
): Promise<listResponseDto | null>;
serachReport(query:string,workspaceid:Types.ObjectId,userid:Types.ObjectId):Promise<listOfAbsuseReposnseDTO[]>
}