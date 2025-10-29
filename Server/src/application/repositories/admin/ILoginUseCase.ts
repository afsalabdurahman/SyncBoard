import { User } from "../../../domain/entities/User"
import { adminResponseDTO, LoginRequestDTO ,SuperadminResponseDTO} from "../../dto/AuthDTOs"
export interface ILoginUseCase {
execute(input:LoginRequestDTO):Promise<adminResponseDTO|null>
superAdmin(input:LoginRequestDTO):Promise<SuperadminResponseDTO|null>
}