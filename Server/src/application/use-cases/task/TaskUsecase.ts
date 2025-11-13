import { inject, injectable } from "tsyringe";
import { Task } from "../../../domain/entities/Task";
import { NotFoundError, ValidationError } from "../../../utils/errors";
import { ITaskRepository } from "../../../domain/interfaces/repositories/ITaskRepository";
import { ITaskUseCase } from "../../repositories/ITask";
import { io } from "../../../server";
import { TaskRequestDTO, TaskResponseDTO } from "../../dto/TaskDTOs";
import { TaskMapper } from "../../mappers/TaskMapper";
import { ResponseMessages } from "../../../common/erroResponse";
@injectable()
export class TaskUsecase implements ITaskUseCase {
  constructor(
    @inject("TaskRepository") private _taskRepository: ITaskRepository
  ) {}

  async execute(input: TaskRequestDTO): Promise<TaskResponseDTO> {
    const isValid = TaskMapper.validateTask(input);
    console.log(input)
    if (!isValid.success) throw new ValidationError(ResponseMessages.INVALID_INPUT);

    const taskEntity = TaskMapper.mapTaskToEntity(input);
    const taskData = await this._taskRepository.create(taskEntity);
    if (!taskData) throw new NotFoundError("Task not created");

    const responseDTO = await TaskMapper.mapEntityToTask("Task is created",taskData);
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
    const responseDTO=TaskMapper.mapEntityToTask("Task is updated",updatetask)
    return responseDTO;
  }
  async deleteTask(taskId: string): Promise<void> {
    await this._taskRepository.deleteTask(taskId);
  }
  async myTask(userName: string, query: any): Promise<Task> {

    const myTask = await this._taskRepository.myTask(userName, query);
    return myTask;
  }
  async updateTaskStatus(taskId: string, status: string): Promise<void> {
    await this._taskRepository.updateTaskStatus(taskId, status);
  }
  async completedTask(): Promise<any> {
    const [completedTasks, taskReject] =
      await this._taskRepository.allCompletedTasks();
    const tasks = [...completedTasks, ...taskReject];
    const mappedData = tasks.map((task: any) => {
      return {
        id: task._id,
        taskName: task.name,
        project: task.project,
        username: task.assignedUser,
        status:
          task.approvalStatus == "Waiting"
            ? "pending"
            : task.approvalStatus == "Approved"
              ? "approved"
              : task.approvalStatus == "Rejected"
                ? "rejected"
                : "pending",

        submittedAt: task.updatedAt,
        rejectionReason: task.rejectionMsg,
      };
    });

    return mappedData;
  }
  async updateApprovalStatus(
    taskId: string,
    status: string,
    msg?: string | null
  ): Promise<void> {
    await this._taskRepository.updateApprovalStatus(taskId, status, msg);
  }

  async findTaskByProjectId(projectId: string): Promise<any> {
    const projectTask =
      await this._taskRepository.findTaskByProjectId(projectId);

    return projectTask;
  }
 async paginationTask(page: number, limit: number, skip: number): Promise<any> {
    const {items,totalItems} = await this._taskRepository.getPagenationaTask(page,limit,skip)
   return {items:items,totalItems}
 }
}
