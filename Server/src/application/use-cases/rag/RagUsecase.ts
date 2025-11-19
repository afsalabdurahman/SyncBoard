
import { injectable,inject } from "tsyringe";
import { RagQueryRequestDTO,RagQueryResponseDTO } from "../../dto/RagDTOs";
import { IRagUsecase } from "../../repositories/IRag";
import {IRagOrchestartorService} from "../../../domain/interfaces/services/IRagOrchestartorService"

@injectable()
export class RagUseCase implements IRagUsecase  {
    constructor(@inject("RagOrchestrator")private _ragOrchestartor:IRagOrchestartorService ){}

async execute(input: RagQueryRequestDTO): Promise<string> {
    console.log(input.user,input.query,"from usecases")
    const result=await this._ragOrchestartor.search(input.user,input.query)
return result

}

}