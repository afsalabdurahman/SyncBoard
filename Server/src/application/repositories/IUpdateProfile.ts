import { User } from "../../domain/entities/User"


export interface IUpdateProfileUsecases {
    execute(userId:string,...args: any[]): Promise<User>;
}