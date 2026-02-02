<<<<<<< HEAD
import { adminResponseDTO, LoginRequestDTO ,SuperadminLoginResponseDTO,SuperadminResponseDTO} from "../../dto/AuthDTOs"
=======
import { adminResponseDTO, LoginRequestDTO ,SuperadminLoginResponseDTO} from "../../dto/AuthDTOs"
>>>>>>> fix/eslint
export interface ILoginUseCase {
execute(input:LoginRequestDTO):Promise<adminResponseDTO|null>
superAdmin(input:LoginRequestDTO):Promise<SuperadminLoginResponseDTO|null>

}