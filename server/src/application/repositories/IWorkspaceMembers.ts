import { Workspace } from "../../domain/entities/Workspace";
import { UserDoument } from "../../infrastructure/database/models/UserModel";

export interface IWokspaceMember {
    getWorkspceDate(slug: string): Promise<UserDoument[] | null>
    paginationWorkspace(slug: string, page: number, limit: number, skip: number): Promise<{ items: UserDoument[] | null, totalItems: number }>

}