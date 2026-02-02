import { Types } from "mongoose";
import { ProjectRepositoryDTO } from "../../../application/dto/ProjectDTOs";
import { Project } from "../../entities/Project";
import { IBaseRepository } from "./IBaseReposiory";
export interface IProjectRepository extends IBaseRepository <Project> {
    
    getAllProjects(workspaceId:Types.ObjectId):Promise<ProjectRepositoryDTO[]|null>
    removeAttachment(projectId:string,attachedUrl:string):Promise<void>
    updateProject(projectId:string,merged:Record<string,string>):Promise<Project|null>
    deleteProject(projectId:string):Promise<void>;
    countProject():Promise<number>;
    findProjectbyAdminId(id:string):Promise<Project[]>
    getPagenationProjects(workspaceId:string,page:number,limit:number,skip:number):Promise<{items:ProjectRepositoryDTO[],totalItems:number}>
}