import { Task } from "../../entities/Task";
import { TaskPaginatedResponse } from "../../../application/dto/TaskDTOs";
export interface ITaskRepository {
  create(dto: Task): Promise<Task | null>;
  getAlltask(): Promise<Task[] | null>;
  updatetask(taskId: string, merged:  Record<string,string>): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  myTask(userName:string,query?:any):Promise<Task>;
  updateTaskStatus(taskId:string,updatedStatus:string):Promise<void>;
  allCompletedTasks():Promise<any>;
  updateApprovalStatus(taskId:string,status:string,msg?:string|null):Promise<void>
  findTaskByProjectId(projectId:string):Promise<Task|null>;
  countTask():Promise<number>
   getPagenationaTask(page:number,limit:number,skip:number):Promise<{ items: Task[];
     totalItems: number}>
}
