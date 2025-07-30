import {ProjectRequstDTO} from "../../presentation/dots/projectDTO/requestDTO"
import {ProjectResponseDTO} from"../../presentation/dots/projectDTO/resposnseDTO"
import { Project } from "../../domain/entities/Project"
export interface IProjectUsecase{
excute(projectEntity:Project):Promise<Project>
getAllProjects():Promise<Project>
removeAttachment(projectId:string,attachedUrl:string):Promise<void>
update(projectId:string,...args: any[]): Promise<boolean>;
deleteProject(projectId:string):Promise<void>

}