import { Task } from "../../domain/entities/Task";
export interface ITaskUseCase {
    execute(taskEntiry:Task):Promise<Task>
    getAllTasks():Promise<Task>
    update(taskId:string,...args: any[]): Promise<boolean>;
    deleteTask(taskId:string):Promise<void>
    myTask(userName:string,query?:string):Promise<Task|any>
    updateTaskStatus(taskId:string,status:string):Promise<void>
    completedTask():Promise<any>
    updateApprovalStatus(taskId:string,status:string,msg?:string):Promise<void>;
    findTaskByProjectId(projectId:string):Promise<any>;
}