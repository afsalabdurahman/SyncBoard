import { Workspace } from "../../domain/entities/Workspace";

export interface IWokspaceMember {
 getWorkspceDate (slug:string):Promise<Workspace>
 paginationWorkspace(slug:string,page:number,limit:number,skip:number):Promise<any>
 
}