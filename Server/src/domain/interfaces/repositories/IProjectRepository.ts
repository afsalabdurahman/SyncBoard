import { Project } from "../../entities/Project";
export interface IProjectRepository {
    create (dto:Project):Promise<Project|null>
    getAllProjects():Promise<any|null>
    removeAttachment(projectId:string,attachedUrl:string):Promise<void>
    updateProject(projectId:string,merged:any):Promise<boolean>
    deleteProject(projectId:string):Promise<void>
}