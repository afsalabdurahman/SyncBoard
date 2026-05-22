import { User } from "../../domain/entities/User";
import { UserDoument } from "../../infrastructure/database/models/UserModel";
import { UserResponseDTO } from "../dto/SuperDTO";

export interface IWokspaceMember {
     getMembers(slug:string,query:string):Promise<UserResponseDTO[]>
    getWorkspceDate(slug: string): Promise<UserDoument[] | null>
    paginationWorkspace(slug: string, page: number, limit: number, skip: number): Promise<{ items: UserDoument[] | null, totalItems: number }>

}