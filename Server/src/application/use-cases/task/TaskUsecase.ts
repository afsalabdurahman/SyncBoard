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
async myTask(userName: string): Promise<Task> {
   const myTask=await this.taskRepository.myTask(userName)
   console.log(myTask,"from usecase##")
   return myTask
}

}