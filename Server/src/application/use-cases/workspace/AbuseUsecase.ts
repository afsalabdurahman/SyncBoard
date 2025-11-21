import { inject, injectable } from "tsyringe";
import { AbuseRequestDTO } from "../../dto/AbuseDTO";
import { IAbuseUsecase } from "../../repositories/IAbuse";
import { IAbuseRepository } from "../../../domain/interfaces/repositories/IAbuseRepository";
import { Abuse } from "../../../domain/entities/Abuse";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
import { ValidationError } from "../../../utils/errors";

@injectable()
export class AbuseUsecase implements IAbuseUsecase  {
constructor(@inject("AbuseRepository")private  _abuseRepository:IAbuseRepository){}
async execute(input: AbuseRequestDTO,userId:string): Promise<string> {
    const abuseEntity = new Abuse({description:input.description,otherType:input.otherType,userId:stringToMongoObj(userId),severity:input.severity,type:input.type,})
    if(!abuseEntity) throw new ValidationError("Validation failed") 
    const isCreate=await this._abuseRepository.create(abuseEntity)
   return "done" 
}
 
}