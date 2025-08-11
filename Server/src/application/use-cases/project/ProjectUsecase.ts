import { ProjectRequstDTO } from "../../../presentation/dots/projectDTO/requestDTO";
import { ProjectResponseDTO } from "../../../presentation/dots/projectDTO/resposnseDTO";
import {IProjectUsecase} from "../../repositories/IProject";
import { inject,injectable } from "tsyringe";
import {IProjectRepository} from "../../../domain/interfaces/repositories/IProjectRepository"
import { Project } from "../../../domain/entities/Project";
import { NotFoundError } from "../../../utils/errors";
import { io } from "../../../server";
@injectable()
export class ProjectUsecase implements IProjectUsecase{
constructor(@inject ("ProjectRepository")private projectRepository:IProjectRepository ){}

async excute(dto: ProjectRequstDTO): Promise<Project> {
const projectData=await this.projectRepository.create(dto)
console.log(projectData,"projectdata")
if(!projectData) throw new NotFoundError("Project not created")
 io.emit("new-project", {
      name: "New Project is Added",
      message: `🚀 New project ${projectData.name} has been added!`,
    });
return projectData;
}

async getAllProjects(): Promise<Project> {
   let allProjects= await this.projectRepository.getAllProjects()
   if(!allProjects) throw new NotFoundError("Project is not found")
   return allProjects
}
async removeAttachment(projectId: string, attachedUrl: string): Promise<void> {
  await this.projectRepository.removeAttachment(projectId,attachedUrl)
  
}
async update(projectId: string, ...args: Record<string, any>[]): Promise<boolean> {

   const merged = Object.assign({}, ...args);
   console.log(merged,"@merge usecase");
   let updateProject = await this.projectRepository.updateProject(projectId,merged)
   console.log(updateProject,"@updatedProject");
   return true
}
async deleteProject(projectId: string): Promise<void> {
  await this.projectRepository.deleteProject(projectId)
}
}