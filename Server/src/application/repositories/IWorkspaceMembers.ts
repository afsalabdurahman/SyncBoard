import { Workspace } from "../../domain/entities/Workspace";

export interface IWokspaceMember {
 getWorkspceDate (slug:string):Promise<Workspace>
}