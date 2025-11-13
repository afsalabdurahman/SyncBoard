import { Project } from "../../entities/Project";
import { IBaseRepository } from "./IBaseReposiory";
export interface IProjectRepository extends IBaseRepository <Project> {
    // create (dto:Project):Promise<Project|null>
    getAllProjects():Promise<any|null>
    removeAttachment(projectId:string,attachedUrl:string):Promise<void>
    updateProject(projectId:string,merged:any):Promise<Project|null>
    deleteProject(projectId:string):Promise<void>;
    countProject():Promise<any>;
    getPagenationProjects(workspaceId:string,page:number,limit:number,skip:number):Promise<any>
}