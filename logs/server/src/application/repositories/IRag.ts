import { RagQueryRequestDTO } from "../dto/RagDTOs"
export interface IRagUsecase {
    execute(input:RagQueryRequestDTO):Promise<string>
}