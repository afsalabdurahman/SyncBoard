
import { Project } from "../../domain/entities/Project"
import { ProjectRepositoryDTO, ProjectRequstDTO, ProjectResponseDTO } from "../dto/ProjectDTOs";
export interface IProjectUsecase{
excute(input:ProjectRequstDTO,workspaceId:string):Promise<ProjectResponseDTO>
getAllProjects(workspaceId:string):Promise<ProjectRepositoryDTO[]|null>
removeAttachment(projectId:string,attachedUrl:string):Promise<void>
update(projectId:string,...args: any[]): Promise<ProjectResponseDTO|null>;
deleteProject(projectId:string):Promise<void>
paginationProjecust(workspaceId:string,page:number,limit:number,skip:number):Promise<{items:ProjectRepositoryDTO[],totalItems:number}>

}