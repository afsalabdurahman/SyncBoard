import { Task } from "../../domain/entities/Task";
import { commentType } from "../../types/taskTypes";
import { commentsDTO, CompletedTaskResponseDTO, TaskRequestDTO, TaskResponseDTO } from "../dto/TaskDTOs";
export interface ITaskUseCase {
    execute(taskEntiry:TaskRequestDTO):Promise<TaskResponseDTO>
    getAllTasks():Promise<Task[]>
    update(taskId:string,...args: string[]): Promise<TaskResponseDTO>;
    deleteTask(taskId:string):Promise<void>
    myTask(userName:string,query?:string):Promise<Task[]>
    updateTaskStatus(taskId:string,status:string):Promise<void>
    completedTask(workspaceid:string):Promise<CompletedTaskResponseDTO>
    updateApprovalStatus(taskId:string,status:string,msg?:string):Promise<void>;
    findTaskByProjectId(projectId:string,filter:string):Promise<Task[]>;
    paginationTask(workspaceId:string,page:number,limit:number,skip:number):Promise<{ items: Task[];
      totalItems: number}>
      addComment(taskId:string,comment:commentType):Promise<void>
      getTaskComments(taskId:string):Promise<commentsDTO[]|null>
      deleteAttachment(taskId:string,url:string):Promise<string>;
}