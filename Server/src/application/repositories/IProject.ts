
import { Project } from "../../domain/entities/Project"
import { ProjectRequstDTO, ProjectResponseDTO } from "../dto/ProjectDTOs";
export interface IProjectUsecase{
excute(input:ProjectRequstDTO):Promise<ProjectResponseDTO>
getAllProjects():Promise<Project>
removeAttachment(projectId:string,attachedUrl:string):Promise<void>
update(projectId:string,...args: any[]): Promise<boolean>;
deleteProject(projectId:string):Promise<void>
paginationProjecust(page:number,limit:number,skip:number):Promise<any>

}