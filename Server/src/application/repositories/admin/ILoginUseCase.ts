import { User } from "../../../domain/entities/User"
export interface ILoginUseCase {
execute(email:string,password:string):Promise<User|null>
}