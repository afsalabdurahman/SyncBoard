import mongoose from "mongoose";
import { Task } from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/interfaces/repositories/ITaskRepository";
import { InternalServerError, NotFoundError } from "../../utils/errors";
import { TaskModel } from "../database/models/TaskModel";
import { commentType } from "../../types/taskTypes";
import { commentsDTO } from "../../application/dto/TaskDTOs";

export class TaskRepository implements ITaskRepository {
  async create(dto: Task): Promise<Task | null> {
    let task = await TaskModel.create(dto);
    return task;
  }
  async getAlltask(): Promise<Task[] | null> {
    const tasks = await TaskModel.find();

    return tasks;
  }
  async updatetask(taskId: string, merged: Record<string, string>): Promise<Task> {

    const objectId = new mongoose.Types.ObjectId(taskId.toString());
    const updatedTask = await TaskModel.findByIdAndUpdate(
      objectId,
      { $set: merged },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      throw new Error("Task not found");
    }

    return updatedTask;


  }

  async deleteTask(taskId: string): Promise<void> {
    const objectId = new mongoose.Types.ObjectId(taskId.toString());
    await TaskModel.deleteOne({ _id: objectId });
  }
  async myTask(userName: string, query?: any): Promise<Task> {

    if (query == "count") {
      const myTask = await TaskModel.find({
        assignedUser: userName,
      });

      return myTask;
    }

    const myTask = await TaskModel.find({
      assignedUser: userName,
      approvalStatus: { $ne: "Approved" },
    });

    //   isApprove: { $ne: "approved" }

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
    const taskReject = await TaskModel.find({ approvalStatus: "Rejected" });

    return [completedTasks, taskReject];
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
        { $set: { approvalStatus: "Approved", rejectionMsg: null } }
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
  async findTaskByProjectId(projectId: string): Promise<Task | null> {
    const ProjectTask = await TaskModel.find({ projectId: projectId });
    return ProjectTask;
  }
  countTask(): Promise<number> {
    const countTask = TaskModel.countDocuments();
    return countTask
  }
  async getPagenationaTask(page: number, limit: number, skip: number): Promise<{
    items: Task[];
    totalItems: number;
  }> {
    const totalItems = await TaskModel.countDocuments();
    const items = await TaskModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return { items, totalItems }

  }
  async addComments(taskId: string, comments: commentType): Promise<Task | null> {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { $push: { comments: comments } },
      { new: true, runValidators: true } // Important options
    )

      .exec();
    return updatedTask ?? null;
  }

async getTaskbyId(taskId: string): Promise<Task | null> {
    const task=await TaskModel.findById(taskId)
    console.log(task,"TaskReposioty")
  return task ?? null
}
}
