import { User } from "../../domain/entities/User"
export interface IUserUsecase {
    execute(id: string): Promise<User | null>
    findUserByEmail(email: string): Promise<User>
}