import { Types } from "mongoose";
import { Abuse } from "../../entities/Abuse";
import { IBaseRepository } from "./IBaseReposiory";
import { GetAllReportsResponseDto } from "../../../application/dto/AbuseDTO";

export interface IAbuseRepository extends IBaseRepository <Abuse>{
    getAllReports(page:number,limit:number,skip:number,):Promise<GetAllReportsResponseDto>
    updateReport(id:Types.ObjectId|string,status:string):Promise<void>
}