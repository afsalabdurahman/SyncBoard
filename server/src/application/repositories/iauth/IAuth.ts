import { User } from "../../../domain/entities/User"
import { Workspace } from "../../../domain/entities/Workspace";
import { AdminSignupResponseDTO ,AdminSignupRequestDTO } from "../../dto/AuthDTOs"

export interface IAuth{
    execute(RegisterInput:AdminSignupRequestDTO):Promise<User>;
    googleAuth(credential:string): Promise<{workspace:Workspace|null,savedUser:User,token:string,refreshToken:string}>
}