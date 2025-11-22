import { IProjectUsecase } from "../../repositories/IProject";
import { inject, injectable } from "tsyringe";
import { IProjectRepository } from "../../../domain/interfaces/repositories/IProjectRepository";
import { Project } from "../../../domain/entities/Project";
import { ConflictError, NotFoundError, ValidationError } from "../../../utils/errors";
import { io } from "../../../server";
import { ProjectRequstDTO, ProjectResponseDTO } from "../../dto/ProjectDTOs";
import { ProjectMapper } from "../../mappers/ProjectMapper";
import { ResponseMessages } from "../../../common/erroResponse";
@injectable()
export class ProjectUsecase implements IProjectUsecase {
  constructor(
    @inject("ProjectRepository") private _projectRepository: IProjectRepository) {}

  async excute(dto: ProjectRequstDTO,workspaceId:string): Promise<ProjectResponseDTO> {

    const isValid = ProjectMapper.ValidateProjectData(dto);
    if (!isValid.success) throw new ValidationError(ResponseMessages.INVALID_INPUT);
    const projectEntity = ProjectMapper.mapProjectToEntity(dto,workspaceId);
    const projectData = await this._projectRepository.create(projectEntity);
    if (!projectData) throw new ConflictError("Project not created");

    io.emit("new-project", {
      name: "New Project is Added",
      message: `🚀 New project ${projectData.name} has been added!`,
    });

    const responseDTO = ProjectMapper.mapEntityToProject("Project Create is Success",projectData);
    return responseDTO;
  }

  async getAllProjects(): Promise<Project> {


    let allProjects = await this._projectRepository.getAllProjects();
    if (!allProjects) throw new NotFoundError(ResponseMessages.NOT_FOUND +' Projects');
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
  ): Promise<ProjectResponseDTO|null> {
    const merged = Object.assign({}, ...args);
  
    let updateProject = await this._projectRepository.updateProject(
      projectId,
      merged
    );
 
    if(!updateProject) throw new ValidationError (ResponseMessages.INVALID_INPUT)
    const responseDTO =ProjectMapper.mapEntityToProject("Project is updated",updateProject)
    return responseDTO;
  }
  async deleteProject(projectId: string): Promise<void> {
    await this._projectRepository.deleteProject(projectId);
  }
  async paginationProjecust(workspaceId:string,page: number, limit: number, skip: number): Promise<any> {
    const { items, totalItems } = await this._projectRepository.getPagenationProjects(workspaceId,page, limit, skip)
    return { items: items, totalItems }
  }
}
