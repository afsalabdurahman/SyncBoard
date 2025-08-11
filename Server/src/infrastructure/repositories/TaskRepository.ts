import mongoose from "mongoose";
import { Task } from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/interfaces/repositories/ITaskRepository";
import { InternalServerError, NotFoundError } from "../../utils/errors";
import { ITask, TaskModel } from "../database/models/TaskModel";

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
  async myTask(userName: string, query?: any): Promise<Task | any> {
    console.log(userName, query, "repoooo");
    if (query == "count") {
      const myTask = await TaskModel.find({
        assignedUser: userName,
      });
      console.log(myTask, "muyDVBBB");
      return myTask;
    }

    const myTask = await TaskModel.find({
      assignedUser: userName,
      approvalStatus: { $ne: "Approved" },
    });

    //   isApprove: { $ne: "approved" }
    console.log(myTask, "db mongo###");
    return myTask;
  }
  async updateTaskStatus(taskId: string, updatedStatus: string): Promise<void> {
    const objId = new mongoose.Types.ObjectId(taskId.toString());
    if (updatedStatus == "Completed") {
      await TaskModel.updateOne(
        { _id: objId },
        {
          $set: { status: updatedStatus, approvalStatus: "Waiting" },
          upsert: true,
        }
      );
    } else {
      const updated = await TaskModel.updateOne(
        { _id: objId },
        { $set: { status: updatedStatus } }
      );
    }
  }
  async allCompletedTasks(): Promise<any> {
    const completedTasks = await TaskModel.find({ status: "Completed" });
    const taskReject =  await TaskModel.find({approvalStatus:"Rejected"})

    return [completedTasks,taskReject]
  }
  async updateApprovalStatus(
    taskId: string,
    status: String,
    msg: string | null
  ): Promise<void> {
    const objId = new mongoose.Types.ObjectId(taskId.toString());
    if (msg == null) {
      const updated = await TaskModel.updateOne(
        { _id: objId },
        { $set: { approvalStatus: "Approved",rejectionMsg:null } }
      );
    } else {
      const updated = await TaskModel.updateOne(
        { _id: objId },
        {
          $set: {
            approvalStatus: "Rejected",
            rejectionMsg: msg,
            status: "In Progress",
          },
        },
        { upsert: true }
      );
    }
  }
 async findTaskByProjectId(projectId: string): Promise<any> {
    const ProjectTask=await TaskModel.find({projectId:projectId})
    return ProjectTask
  }
}
