
import { Project } from "../../domain/entities/Project"
import { ProjectRequstDTO, ProjectResponseDTO } from "../dto/ProjectDTOs";
export interface IProjectUsecase{
excute(input:ProjectRequstDTO,workspaceId:string):Promise<ProjectResponseDTO>
getAllProjects():Promise<Project>
removeAttachment(projectId:string,attachedUrl:string):Promise<void>
update(projectId:string,...args: any[]): Promise<ProjectResponseDTO|null>;
deleteProject(projectId:string):Promise<void>
paginationProjecust(workspaceId:string,page:number,limit:number,skip:number):Promise<any>

}