import mongoose from "mongoose";
import { Task } from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/interfaces/repositories/ITaskRepository";
import { NotFoundError } from "../../utils/errors";
import { TaskModel } from "../database/models/TaskModel";

export class TaskRepository implements ITaskRepository {
  async create(dto: Task): Promise<Task | null> {
    console.log(dto, "task repostir@");
    let task = await TaskModel.create(dto);
    console.log(task, "MOngodb repostir@");
    return task;
  }
  async getAlltask(): Promise<any | null> {
    const tasks = await TaskModel.find();
    console.log(tasks, "from mongodb");
    return tasks;
  }
  async updatetask(taskId: string, merged: any): Promise<boolean> {
    const objectId: any = new mongoose.Types.ObjectId(taskId.toString());
    const update = await TaskModel.updateOne(
      { _id: objectId },
      { $set: merged },
      { upsert: true, new: true, runValidators: true }
    );
    console.log(update, "updated mogo@repositoruy");
    return true;
  }

  async deleteTask(taskId: string): Promise<void> {
    const objectId: any = new mongoose.Types.ObjectId(taskId.toString());
    await TaskModel.deleteOne({ _id: objectId });
  }
  async myTask(userName: string): Promise<Task | any> {
    console.log(userName, "mogodb username");
    const myTask = await TaskModel.find({ assignedUser: userName });
    console.log(myTask, "db mongo###");
    return myTask;
  }
}
