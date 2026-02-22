import { IProjectUsecase } from "../../repositories/IProject";
import { inject, injectable } from "tsyringe";
import { IProjectRepository } from "../../../domain/interfaces/repositories/IProjectRepository";
import { ConflictError, NotFoundError, ValidationError } from "../../../utils/errors";
import { io } from "../../../server";
import { ProjectRepositoryDTO, ProjectRequstDTO, ProjectResponseDTO } from "../../dto/ProjectDTOs";
import { ProjectMapper } from "../../mappers/ProjectMapper";
import { ResponseMessages } from "../../../common/erroResponse";
import { ActivityMapper } from "../../mappers/ActivityMapper";
import { IActivityRepository } from "../../../domain/interfaces/repositories/IActivityRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ActivityLogMessage } from "../../../types/activityTypes";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
@injectable()
export class ProjectUsecase implements IProjectUsecase {
  constructor(
    @inject("ProjectRepository") private _projectRepository: IProjectRepository,
    @inject("ActivityRepository") private _activityRepository: IActivityRepository,
    @inject("UserRepository") private _userRepository: IUserRepository
  ) { }

  async excute(dto: ProjectRequstDTO, workspaceId: string): Promise<ProjectResponseDTO> {

    const isValid = ProjectMapper.ValidateProjectData(dto);

    if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
    const projectEntity = ProjectMapper.mapProjectToEntity(dto, workspaceId);
    const projectData = await this._projectRepository.create(projectEntity);
    if (!projectData || !projectData.workspaceId) throw new ConflictError("Project" + ResponseMessages.CREATEION_FAILED);

    io.emit("new-project", {
      name: ResponseMessages.NEW_PROJECT_ADDED,
      message: `🚀 New project ${projectData.name} has been added!`,
    });

    const user = await this._userRepository.findById(dto.projectAdminId)
    if (!user || !user._id) { throw new NotFoundError(ResponseMessages.USER_NOT_FOUND) }


    const activityEntity = ActivityMapper.CreateMappedEntities({ activityType: "project", createdBy: user._id, workspaceId: projectData.workspaceId, logMsg: ActivityLogMessage.PROJECT_CREATED })

    await this._activityRepository.createActivity(activityEntity)
    const responseDTO = ProjectMapper.mapEntityToProject(ResponseMessages.NEW_PROJECT_ADDED, projectData);
    return responseDTO;
  }

  async getAllProjects(workspaceId: string): Promise<ProjectRepositoryDTO[] | null> {
    const allProjects = await this._projectRepository.getAllProjects(stringToMongoObj(workspaceId));

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
    ...args: string[]
  ): Promise<ProjectResponseDTO | null> {
    const merged = Object.assign({}, ...args);

    const updateProject = await this._projectRepository.updateProject(
      projectId,
      merged
    );

    if (!updateProject) throw new ValidationError(ResponseMessages.INVALID_INPUT)
    const responseDTO = ProjectMapper.mapEntityToProject(ResponseMessages.PROJECT_UPDATED, updateProject)
    return responseDTO;
  }
  async deleteProject(projectId: string): Promise<void> {
    await this._projectRepository.deleteProject(projectId);
  }
  async paginationProjecust(workspaceId: string, page: number, limit: number, skip: number): Promise<{ items: ProjectRepositoryDTO[], totalItems: number }> {
    const { items, totalItems } = await this._projectRepository.getPagenationProjects(workspaceId, page, limit, skip)
    return { items, totalItems }
  }
}
