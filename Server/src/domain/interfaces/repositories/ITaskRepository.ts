import { Task } from "../../entities/Task";
export interface ITaskRepository {
  create(dto: Task): Promise<Task | null>;
  getAlltask(): Promise<any | null>;
  updatetask(taskId: string, merged: any): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  myTask(userName:string,query?:any):Promise<Task|any>;
  updateTaskStatus(taskId:string,updatedStatus:string):Promise<void>;
  allCompletedTasks():Promise<any>;
  updateApprovalStatus(taskId:string,status:string,msg?:string|null):Promise<void>
  findTaskByProjectId(projectId:string):Promise<any>;
  countTask():Promise<any>
   getPagenationaTask(page:number,limit:number,skip:number):Promise<any>
}
