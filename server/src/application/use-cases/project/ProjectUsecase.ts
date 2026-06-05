import { IProjectUsecase } from "../../repositories/IProject";
import { inject, injectable } from "tsyringe";
import { IProjectRepository } from "../../../domain/interfaces/repositories/IProjectRepository";
import { ConflictError, NotFoundError, ValidationError } from "../../../utils/errors";
import { io } from "../../../server";
import {  BurnDownData, ProjectMembersNames, ProjectNamesAndId, ProjectRepositoryDTO, ProjectRequstDTO, ProjectResponseDTO } from "../../dto/ProjectDTOs";
import { ProjectMapper } from "../../mappers/ProjectMapper";
import { ResponseMessages } from "../../../common/erroResponse";
import { ActivityMapper } from "../../mappers/ActivityMapper";
import { IActivityRepository } from "../../../domain/interfaces/repositories/IActivityRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ActivityLogMessage } from "../../../types/activityTypes";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
import { ITaskRepository } from "../../../domain/interfaces/repositories/ITaskRepository";
@injectable()
export class ProjectUsecase implements IProjectUsecase {
  constructor(
    @inject("ProjectRepository") private _projectRepository: IProjectRepository,
    @inject("ActivityRepository") private _activityRepository: IActivityRepository,
    @inject("UserRepository") private _userRepository: IUserRepository,
     @inject("TaskRepository") private _taskRepository: ITaskRepository
  ) { }

  async excute(dto: ProjectRequstDTO, workspaceId: string): Promise<ProjectResponseDTO> {

    const isValid = ProjectMapper.ValidateProjectData(dto);
console.log(workspaceId,"ID WORKPSCE IN Usecase")
    if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
    const projectEntity = ProjectMapper.mapProjectToEntity(dto, workspaceId);
    console.log(projectEntity,"Entity Projects")
    const projectData = await this._projectRepository.create(projectEntity);
    if (!projectData || !projectData.workspaceId) throw new ConflictError("Project" + ResponseMessages.CREATION_FAILED);

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
    // eslint-disable-next-line prefer-const
    let merged = Object.assign({}, ...args);
  
if(merged.attachedUrl.length==0){
delete merged.attachedUrl
}else{
  const urls=merged.attachedUrl.map((data:string)=> data);
  delete merged.attachedUrl;
await this._projectRepository.pushToAttachments(urls,projectId)
}
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
 async deleteAttachment(projectId: string, url: string): Promise<void> {
    await this._projectRepository.deleteAttachedURl(stringToMongoObj(projectId),url)
  }
  async findAllAvilableProjectName(workspaceId: string): Promise<ProjectNamesAndId[]> {
    const projectName = await this._projectRepository.AllprojectNames(stringToMongoObj(workspaceId));
    if(!projectName) throw new NotFoundError("No Projects found")
    return projectName 
  }
  async projectMembers(projectId: string): Promise<ProjectMembersNames[]> {
    const data=await this._projectRepository.projectMemebrs(stringToMongoObj(projectId))
   const countMap = new Map<string, number>();
   if(!data) throw new NotFoundError("Members not found")
   for (const name of data) {
    countMap.set(name, (countMap.get(name) || 0) + 1);
  }
  return Array.from(countMap.keys()).map((name) => ({
    name,
    role: countMap.get(name)! > 1 ? "ADMIN" : "MEMBER",
  }));
  }

  async burnoutChartData(projectId: string): Promise<BurnDownData[]> {
    const project = await this._projectRepository.burndownChartProject(stringToMongoObj(projectId))
    const tasks = await this._taskRepository.burnoutChartTask(projectId);

      const startDate = new Date(project?.createdAt || new Date());
  const endDate = new Date(project?.deadline ? project.deadline.toString() : new Date());
  const totalTasks = tasks.length;
   const oneDay = 1000 * 60 * 60 * 24;
     const totalDays =
    Math.ceil((endDate.getTime() - startDate.getTime()) / oneDay) + 1;
 const data: { day: string; value: number }[] = [];
const stepDays = 15;
  for (let i = 0; i < totalDays; i+=stepDays) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    // const formattedDate = currentDate.toISOString().split("T")[0];

    // completed tasks till this day
    const completed  = tasks.filter((task) => {
      return (
        task.status === "Completed" &&
        task.updatedAt && new Date(task.updatedAt) <= currentDate
      );
    }).length;

    const remaining = totalTasks - completed ;

    const day = currentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })

   data.push({
      day,
      value: remaining,
    });
  }
  return data
  }
}
