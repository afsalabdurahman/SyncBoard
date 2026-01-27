import { User } from "../../domain/entities/User"


export interface IUpdateProfileUsecases {
    execute(userId:string,...args: string[]): Promise<User>;
    updateOnlineStatus(userId:string):Promise<void>
    logoutUser(userId:string):Promise<boolean>
}