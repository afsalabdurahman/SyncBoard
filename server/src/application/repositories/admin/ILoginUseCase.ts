import { adminResponseDTO, LoginRequestDTO ,SuperadminLoginResponseDTO} from "../../dto/AuthDTOs"
export interface ILoginUseCase {
execute(userId:string,workspaceId:string):Promise<adminResponseDTO|null>
superAdmin(input:LoginRequestDTO):Promise<SuperadminLoginResponseDTO|null>
googleAuthAdmin(credential:string):Promise<adminResponseDTO|null>
}