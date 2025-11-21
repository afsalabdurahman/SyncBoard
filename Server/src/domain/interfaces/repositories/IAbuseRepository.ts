import { AbuseRequestDTO } from "../../../application/dto/AbuseDTO";
import { Abuse } from "../../entities/Abuse";
import { IBaseRepository } from "./IBaseReposiory";

export interface IAbuseRepository extends IBaseRepository <Abuse>{
    // create(input:AbuseRequestDTO):Promise<void>
}