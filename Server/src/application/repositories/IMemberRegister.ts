import { User } from "../../domain/entities/User";

export interface IMemberRegister {
    execute (name:string,email:string,password:string,slug:string,title:string,role:string) :Promise<User>
}