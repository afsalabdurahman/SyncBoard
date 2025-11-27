import { Types } from "mongoose";
import { AbuseRequestDTO } from "../../../application/dto/AbuseDTO";
import { Abuse } from "../../entities/Abuse";
import { IBaseRepository } from "./IBaseReposiory";

export interface IAbuseRepository extends IBaseRepository <Abuse>{
    // create(input:AbuseRequestDTO):Promise<void>
    getAllReports(page:number,limit:number,skip:number,):Promise<Abuse[]>
    updateReport(id:Types.ObjectId|string,status:string):Promise<void>
}