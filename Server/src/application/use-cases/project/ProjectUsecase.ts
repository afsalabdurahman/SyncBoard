import { IProjectUsecase } from "../../repositories/IProject";
import { inject, injectable } from "tsyringe";
import { IProjectRepository } from "../../../domain/interfaces/repositories/IProjectRepository";
import { Project } from "../../../domain/entities/Project";
import { NotFoundError, ValidationError } from "../../../utils/errors";
import { io } from "../../../server";
import { ProjectRequstDTO, ProjectResponseDTO } from "../../dto/ProjectDTOs";
import { ProjectMapper } from "../../mappers/ProjectMapper";
@injectable()
export class ProjectUsecase implements IProjectUsecase {
  constructor(
    @inject("ProjectRepository") private _projectRepository: IProjectRepository
  ) {}

  async excute(dto: ProjectRequstDTO): Promise<ProjectResponseDTO> {

    const isValid = ProjectMapper.ValidateProjectData(dto);
    if (!isValid.success) throw new ValidationError("Validation failed");

    const projectEntity = ProjectMapper.mapProjectToEntity(dto);

console.log(projectEntity,"entity is creted....")

// const projects= await this._projectRepository.getAllProjects();
// console.log(projects[0],"frist projectss")


    const projectData = await this._projectRepository.create(projectEntity);

    if (!projectData) throw new NotFoundError("Project not created");

    io.emit("new-project", {
      name: "New Project is Added",
      message: `🚀 New project ${projectData.name} has been added!`,
    });

    const responseDTO = ProjectMapper.mapEntityToProject("Project Create is Success" );
    return responseDTO;
  }

  async getAllProjects(): Promise<Project> {

    
    let allProjects = await this._projectRepository.getAllProjects();
    if (!allProjects) throw new NotFoundError("Project is not found");
    return allProjects;
  }
  async removeAttachment(
    projectId: string,
    attachedUrl: string
  ): Promise<void> {
    await this._projectRepository.removeAttachment(projectId, attachedUrl);
  }
  async update(
    projectId: string,
    ...args: Record<string, any>[]
  ): Promise<boolean> {
    const merged = Object.assign({}, ...args);
    console.log(merged, "@merge usecase");
    let updateProject = await this._projectRepository.updateProject(
      projectId,
      merged
    );
    console.log(updateProject, "@updatedProject");
    return true;
  }
  async deleteProject(projectId: string): Promise<void> {
    await this._projectRepository.deleteProject(projectId);
  }
  async paginationProjecust(page: number, limit: number, skip: number): Promise<any> {
   const {items,totalItems} = await this._projectRepository.getPagenationProjects(page,limit,skip)
   return {items:items,totalItems}
  }
}
