import { AdminSignupResponseDTO ,AdminSignupRequestDTO } from "../../dto/AuthDTOs"

export interface IAuth{
    execute(RegisterInput:AdminSignupRequestDTO):Promise<AdminSignupResponseDTO>
}