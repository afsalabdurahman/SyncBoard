import { Task } from "../../domain/entities/Task";
export interface ITaskUseCase {
    execute(taskEntiry:Task):Promise<Task>
    getAllTasks():Promise<Task>
    update(taskId:string,...args: any[]): Promise<boolean>;
    deleteTask(taskId:string):Promise<void>
    myTask(userName:string):Promise<Task>
}