import { inject, injectable } from "tsyringe";
import { Task } from "../../../domain/entities/Task";
import { NotFoundError, ValidationError } from "../../../utils/errors";
import { ITaskRepository } from "../../../domain/interfaces/repositories/ITaskRepository";
import { ITaskUseCase } from "../../repositories/ITask";
import { io } from "../../../server";
import { commentsDTO, CompletedTaskResponseDTO, donetChartData, FormattedTask, projectSpecifyTaskCount, TaskRequestDTO, TaskResponseChartDTO, TaskResponseDTO } from "../../dto/TaskDTOs";
import { TaskMapper } from "../../mappers/TaskMapper";
import { ResponseMessages } from "../../../common/erroResponse";
import { commentType, taskType } from "../../../types/taskTypes";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
import { taskFilter } from "../../../utils/taskFilter";
@injectable()
export class TaskUsecase implements ITaskUseCase {
  constructor(
    @inject("TaskRepository") private _taskRepository: ITaskRepository
  ) { }

  async execute(input: TaskRequestDTO): Promise<TaskResponseDTO> {
    const isValid = TaskMapper.validateTask(input);

    if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
    //const vectors= await addToVectors(input)
    const vectors = [1]
    const taskEntity = TaskMapper.mapTaskToEntity(input, vectors);

    const taskData = await this._taskRepository.create(taskEntity);
    if (!taskData) throw new NotFoundError("Task not created");
    const responseDTO = await TaskMapper.mapEntityToTask("Task is created", taskData);
    io.emit("new-task", {
      name: input.name,
      message: `🚀 New task "${input.name}" has been added!`,
    });

    return responseDTO;
  }

  async getAllTasks(): Promise<Task[]> {
    const allTasks = await this._taskRepository.getAlltask();
    if (!allTasks) throw new NotFoundError("Task is not found");
    return allTasks;
  }
  async update(taskId: string, ...args: string[]): Promise<TaskResponseDTO> {

    const merged = Object.assign({}, ...args);
    const updatetask = await this._taskRepository.updatetask(taskId, merged);
    if (!updatetask) throw new NotFoundError(ResponseMessages.TASK_NOT_FOUND)
    const responseDTO = TaskMapper.mapEntityToTask("Task is updated", updatetask)
    return responseDTO;
  }
  async deleteTask(taskId: string): Promise<void> {
    await this._taskRepository.deleteTask(taskId);
  }
  async myTask(userName: string, query: string): Promise<Task[]> {

    const myTask = await this._taskRepository.myTask(userName, query);
    return myTask;
  }
  async updateTaskStatus(taskId: string, status: string): Promise<void> {
    await this._taskRepository.updateTaskStatus(taskId, status);
  }
  async completedTask(workspaceid: string, page: number, limit?: number, skip?: number,projectId?:string|null): Promise<{ items: CompletedTaskResponseDTO, totalItems: number }> {

    const { completedTasks, taskReject, totalItems } =
      await this._taskRepository.allCompletedTasks(stringToMongoObj(workspaceid), page, limit, skip,projectId);
    const tasks = [
      ...(Array.isArray(completedTasks) ? completedTasks : [completedTasks]),
      ...(Array.isArray(taskReject) ? taskReject : [taskReject]),
    ] as taskType[]

    const mappedData = TaskMapper.MappedCompletdTask(tasks);

    return { items: mappedData, totalItems }
  }
  async updateApprovalStatus(
    taskId: string,
    status: string,
    msg?: string | null
  ): Promise<void> {

    await this._taskRepository.updateApprovalStatus(taskId, status, msg);
  }

  async findTaskByProjectId(projectId: string, filter: string): Promise<Task[]> {
    const taskfilter = taskFilter(filter) ?? null
    const projectTask =
      await this._taskRepository.findTaskByProjectId(projectId, taskfilter);

    if (!projectTask) throw new NotFoundError(ResponseMessages.NO_CONTENT)

    return projectTask;
  }
  async paginationTask(workspaceId: string, page: number, limit: number, skip: number,projectId:string|null): Promise<{
    items: Task[];
    totalItems: number
  }> {
    const { items, totalItems } = await this._taskRepository.getPagenationaTask(stringToMongoObj(workspaceId), page, limit, skip,projectId)
    return { items: items, totalItems }
  }
  async addComment(taskId: string, comment: commentType): Promise<void> {
    await this._taskRepository.addComments(taskId, comment);

  }
  async getTaskComments(taskId: string): Promise<commentsDTO[] | null> {
    const task = await this._taskRepository.getTaskbyId(taskId)
    if (!task) return null
    const comments = TaskMapper.mappedEntityToComments(task)
    return comments

  }
  async deleteAttachment(taskId: string, url: string): Promise<string> {
    const task = await this._taskRepository.deleteAttachment(taskId, url);
    if (!task) throw new NotFoundError(ResponseMessages.NO_CONTENT);
    return ResponseMessages.DELETED
  }
  async deleteSubTask(taskId: string, subTask: string): Promise<void> {
    await this._taskRepository.deleteSubTask(stringToMongoObj(taskId), subTask);
  }
  async updateSubtask(taskId: string, title: string): Promise<void> {
    await this._taskRepository.updateSubTask(stringToMongoObj(taskId), title)
  }
  async findTaskCountByProjectId(projectId: string): Promise<projectSpecifyTaskCount> {
    const result = await this._taskRepository.findTaskCountByProjectId(projectId);
    result.projectProgress = ( result.completed_task/ result.total_task) * 100 || 0
    return result 
  }
  async findDonetChartData(projectId: string): Promise<donetChartData> {
    const result = await this._taskRepository.donetChartData(projectId);
    return result
  }
  async findTasksByProjectId(projectId: string): Promise<FormattedTask[]> {
    const tasks = await this._taskRepository.burnoutChartTask(projectId);
    const formattedTasks = TaskMapper.mapToListtaskDashboard(tasks)
console.log(formattedTasks,"tasksssssssss")
  return formattedTasks

  }
  async findTaskApprovalStatus(projectId: string): Promise<Task[]> {
    const tasks = await this._taskRepository.findTaskApprovalstatus(projectId);
    TaskMapper.mapToApprovalTask(tasks)
    console.log(tasks,"taskssssssss")
return tasks
  }

}
