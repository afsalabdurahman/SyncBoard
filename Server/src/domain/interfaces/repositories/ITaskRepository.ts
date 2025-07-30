import { Task } from "../../entities/Task";
export interface ITaskRepository {
  create(dto: Task): Promise<Task | null>;
  getAlltask(): Promise<any | null>;
  updatetask(taskId: string, merged: any): Promise<boolean>;
  deleteTask(taskId: string): Promise<void>;
  myTask(userName:string):Promise<Task|any>;
}
