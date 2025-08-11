import { inject, injectable } from "tsyringe";
import { Task } from "../../../domain/entities/Task";
import {TaskRequstDTO} from "../../../presentation/dots/taskDTO/requestDTO"
//import { ITaskRepository } from "../../repositories/ITask";
import { NotFoundError } from "../../../utils/errors";
import {ITaskRepository} from "../../../domain/interfaces/repositories/ITaskRepository"
import { ITaskUseCase } from "../../repositories/ITask";
import { io } from "../../../server";
@injectable()
export class TaskUsecase implements ITaskUseCase {

constructor(@inject ("TaskRepository")private taskRepository:ITaskRepository ){}

async execute(taskEntiry: Task): Promise<Task> {
     console.log(taskEntiry,"from usecase@2")
     const taskData=await this.taskRepository.create(taskEntiry)
     if(!taskData) throw new NotFoundError("Project not created")
      io.emit("new-task", {
      name: taskData.name,
      message: `🚀 New task "${taskData.name}" has been added!`,
    });
    return taskData;
}

async getAllTasks(): Promise<Task> {
   let allTasks= await this.taskRepository.getAlltask()
   console.log("@usecase",allTasks)
   if(!allTasks) throw new NotFoundError("Task is not found")
   return allTasks
}
async update(taskId: string, ...args: any[]): Promise<boolean> {
     console.log(taskId,"@usecase Project ID")
  console.log(...args,"@usecaser ARG")
   const merged = Object.assign({}, ...args);
    console.log(merged,"@merge usecase");
      let updatetask = await this.taskRepository.updatetask(taskId,merged)
      return true
}
async deleteTask(taskId: string): Promise<void> {
   await this.taskRepository.deleteTask(taskId)
}
async myTask(userName: string,query:any): Promise<Task> {
   console.log(userName,"@task use,",query,"@task use")

   const myTask=await this.taskRepository.myTask(userName,query)
   console.log(myTask,"from usecase##")
   return myTask
}
async updateTaskStatus(taskId: string, status: string): Promise<void> {
  await this.taskRepository.updateTaskStatus(taskId,status)
}
async completedTask(): Promise<any> {
    
   const [completedTasks,taskReject] = await this.taskRepository.allCompletedTasks()
   const tasks=[...completedTasks,...taskReject]
 const mappedData = tasks.map((task:any) => {
  return {
   id:task._id,
    taskName: task.name,
    project: task.project,
    username: task.assignedUser,
    status: task.approvalStatus=="Waiting"?"pending":
            task.approvalStatus=="Approved"?"approved":
            task.approvalStatus=="Rejected"?"rejected":"pending",
            
    submittedAt: task.updatedAt,
    rejectionReason : task.rejectionMsg,
    
  };
});

console.log(mappedData,"mapped")
   return mappedData
}
async updateApprovalStatus(taskId: string, status: string, msg?: string|null): Promise<void> {
   await this.taskRepository.updateApprovalStatus(taskId,status,msg)
}

async findTaskByProjectId(projectId: string): Promise<any> {
const  projectTask = await this.taskRepository.findTaskByProjectId(projectId)

console.log(projectTask,"from useCse@projec++")
return projectTask
}
}