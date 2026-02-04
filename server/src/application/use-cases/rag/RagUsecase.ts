
import { injectable,inject } from "tsyringe";
import { RagQueryRequestDTO } from "../../dto/RagDTOs";
import { IRagUsecase } from "../../repositories/IRag";
import {IRagOrchestartorService} from "../../../domain/interfaces/services/IRagOrchestartorService"

@injectable()
export class RagUseCase implements IRagUsecase  {
    constructor(@inject("RagOrchestrator")private _ragOrchestartor:IRagOrchestartorService ){}

async execute(input: RagQueryRequestDTO): Promise<string> {
    const result=await this._ragOrchestartor.search(input.user,input.query)
return result

}

}