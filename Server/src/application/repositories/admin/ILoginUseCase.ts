import { User } from "../../../domain/entities/User"
import { adminResponseDTO, LoginRequestDTO } from "../../dto/AuthDTOs"
export interface ILoginUseCase {
execute(input:LoginRequestDTO):Promise<adminResponseDTO|null>
}