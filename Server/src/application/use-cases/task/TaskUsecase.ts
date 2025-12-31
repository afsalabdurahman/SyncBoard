import { inject, injectable } from "tsyringe";
import { Task } from "../../../domain/entities/Task";
import { NotFoundError, ValidationError } from "../../../utils/errors";
import { ITaskRepository } from "../../../domain/interfaces/repositories/ITaskRepository";
import { ITaskUseCase } from "../../repositories/ITask";
import { io } from "../../../server";
import { commentsDTO, CompletedTaskResponseDTO, TaskRequestDTO, TaskResponseDTO } from "../../dto/TaskDTOs";
import { TaskMapper } from "../../mappers/TaskMapper";
import { ResponseMessages } from "../../../common/erroResponse";
import { addToVectors } from "../../../infrastructure/services/ragPipeline/ConvertToVector";
import { commentType } from "../../../types/taskTypes";
@injectable()
export class TaskUsecase implements ITaskUseCase {
  constructor(
    @inject("TaskRepository") private _taskRepository: ITaskRepository
  ) { }

  async execute(input: TaskRequestDTO): Promise<TaskResponseDTO> {
    const isValid = TaskMapper.validateTask(input);
    console.log(input)
    if (!isValid.success) throw new ValidationError(ResponseMessages.INVALID_INPUT);
    //const vectors= await addToVectors(input)
    const vectors = [1]
    const taskEntity = TaskMapper.mapTaskToEntity(input, vectors);
    console.log(taskEntity,"taskEntity...")
    const taskData = await this._taskRepository.create(taskEntity);
    if (!taskData) throw new NotFoundError("Task not created");

    const responseDTO = await TaskMapper.mapEntityToTask("Task is created", taskData);
    io.emit("new-task", {
      name: taskData.name,
      message: `🚀 New task "${taskData.name}" has been added!`,
    });

    return responseDTO;
  }

  async getAllTasks(): Promise<Task> {
    let allTasks = await this._taskRepository.getAlltask();
    if (!allTasks) throw new NotFoundError("Task is not found");
    return allTasks;
  }
  async update(taskId: string, ...args: any[]): Promise<TaskResponseDTO> {

    const merged = Object.assign({}, ...args);
    let updatetask = await this._taskRepository.updatetask(taskId, merged);
    const responseDTO = TaskMapper.mapEntityToTask("Task is updated", updatetask)
    return responseDTO;
  }
  async deleteTask(taskId: string): Promise<void> {
    await this._taskRepository.deleteTask(taskId);
  }
  async myTask(userName: string, query: string): Promise<Task> {

    const myTask = await this._taskRepository.myTask(userName, query);
    return myTask;
  }
  async updateTaskStatus(taskId: string, status: string): Promise<void> {
    await this._taskRepository.updateTaskStatus(taskId, status);
  }
  async completedTask(): Promise<CompletedTaskResponseDTO> {
    const [completedTasks, taskReject] =
      await this._taskRepository.allCompletedTasks();
    const tasks = [...completedTasks, ...taskReject];
    const mappedData = TaskMapper.MappedCompletdTask(tasks)
    return mappedData;
  }
  async updateApprovalStatus(
    taskId: string,
    status: string,
    msg?: string | null
  ): Promise<void> {
    await this._taskRepository.updateApprovalStatus(taskId, status, msg);
  }

  async findTaskByProjectId(projectId: string): Promise<Task> {
    const projectTask =
      await this._taskRepository.findTaskByProjectId(projectId);
      console.log(projectTask,"Task##")
      if(!projectTask) throw new NotFoundError(ResponseMessages.NOT_FOUND)

    return projectTask;
  }
  async paginationTask(page: number, limit: number, skip: number): Promise<{ items: Task[];
    totalItems: number}> {
    const { items, totalItems } = await this._taskRepository.getPagenationaTask(page, limit, skip)
    return { items: items, totalItems }
  }
  async addComment(taskId: string, comment: commentType): Promise<void> {
    const updatedTask=await this._taskRepository.addComments(taskId,comment)
  console.log(updatedTask,"updatedTask..")
  }
  async getTaskComments(taskId: string): Promise<commentsDTO[] | null> {
    const task = await this._taskRepository.getTaskbyId(taskId)
    if(!task) return null
    const comments=TaskMapper.mappedEntityToComments(task)
    console.log(comments,"usedcesComments")
    return comments

  }
  async deleteAttachment(taskId: string, url: string): Promise<string> {
    const task = await this._taskRepository.deleteAttachment(taskId,url);
    if(!task) throw new NotFoundError(ResponseMessages.NOT_FOUND);
    return ResponseMessages.DELETE
  }
}
