import { adminResponseDTO, LoginRequestDTO ,SuperadminLoginResponseDTO,SuperadminResponseDTO} from "../../dto/AuthDTOs"
export interface ILoginUseCase {
execute(input:LoginRequestDTO):Promise<adminResponseDTO|null>
superAdmin(input:LoginRequestDTO):Promise<SuperadminLoginResponseDTO|null>

}