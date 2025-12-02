import { LoginRequestDTO, LoginResponseDTO } from "../../dto/AuthDTOs";

export interface ILogin{
    loginUser(input:LoginRequestDTO):Promise<LoginResponseDTO>
    logoutUser(userId:string):Promise<void>
}