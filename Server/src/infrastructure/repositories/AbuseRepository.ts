import { AbuseRequestDTO } from "../../application/dto/AbuseDTO";
import { Abuse } from "../../domain/entities/Abuse";
import { IAbuseRepository } from "../../domain/interfaces/repositories/IAbuseRepository";
import { AbuseModel } from "../database/models/AbuseModel";
import { BaseRepository } from "./BaseRepository";
export class AbuseRepository extends BaseRepository <Abuse> implements IAbuseRepository  {
   constructor(){
    super(AbuseModel)
   }
   
}