import { User } from "../../../domain/entities/User"
import { AdminSignupResponseDTO ,AdminSignupRequestDTO } from "../../dto/AuthDTOs"

export interface IAuth{
    execute(RegisterInput:AdminSignupRequestDTO):Promise<User>
}