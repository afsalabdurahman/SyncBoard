import mongoose, { Types } from "mongoose";
import { Task } from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/interfaces/repositories/ITaskRepository";
import {  NotFoundError } from "../../utils/errors";
import { TaskModel } from "../database/models/TaskModel";
import { commentType } from "../../types/taskTypes";
import { ProjectModel } from "../database/models/ProjectModel";

export class TaskRepository implements ITaskRepository {
  async create(dto: Task): Promise<Task | null> {
    const task = await TaskModel.create(dto);
    if (!task) return null;
    return new Task({ ...task, id: task._id?.toString() });
  }
  async getAlltask(): Promise<Task[] | null> {
    const tasks = await TaskModel.find().lean().exec();
    if (!tasks) return null
    return tasks;
  }
  async updatetask(taskId: string, merged: Record<string, string>): Promise<Task | null> {

    const objectId = new mongoose.Types.ObjectId(taskId.toString());
    const updatedTask = await TaskModel.findByIdAndUpdate(
      objectId,
      { $set: merged },
      { new: true, runValidators: true }
    ).exec()

    if (!updatedTask) return null;
    return new Task({ ...updatedTask, id: updatedTask._id?.toString() });


  }

  async deleteTask(taskId: string): Promise<void> {
    const objectId = new mongoose.Types.ObjectId(taskId.toString());
    await TaskModel.deleteOne({ _id: objectId });
  }
  async myTask(userName: string, query?: string): Promise<Task[]> {

    if (query == "count") {
      const myTask = await TaskModel.find({
        assignedUser: userName,
      }).lean().exec()

      return myTask;
    }

    const myTask = await TaskModel.find({
      assignedUser: userName,
      approvalStatus: { $ne: "Approved" },
    });



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
      await TaskModel.updateOne(
        { _id: objId },
        { $set: { status: updatedStatus } }
      );
    }
  }
  async allCompletedTasks(workspaceid: Types.ObjectId, page?: number, limit?: number, skip?: number): Promise<{ completedTasks: Task[], taskReject: Task[], totalItems: number }> {

    if (!limit) throw new NotFoundError("not found")
    const completedTasks = await TaskModel.find({ status: "Completed" }).skip(skip ?? 0).limit(Math.ceil(limit / 2)).sort({ createdAt: -1 }).lean().exec()
    const taskReject = await TaskModel.find({ approvalStatus: "Rejected" }).skip(skip ?? 0).limit(Math.ceil(limit / 2)).sort({ createdAt: -1 }).lean().exec()
    const totalItems = await TaskModel.countDocuments();
    // const items = await TaskModel.find()
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 });

    return { completedTasks, taskReject, totalItems };
  }
  async updateApprovalStatus(
    taskId: string,
    status: string,
    msg: string | null
  ): Promise<void> {
    const objId = new mongoose.Types.ObjectId(taskId.toString());
    if (msg == null) {
      await TaskModel.updateOne(
        { _id: objId },
        { $set: { approvalStatus: "Approved", rejectionMsg: null } }
      );
    } else {
      await TaskModel.updateOne(
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
  async findTaskByProjectId(projectId: string, taskfilter: string | null): Promise<Task[] | null> {
    const query: Record<string, string> = { projectId };
    if (taskfilter) {
      query.status = taskfilter;
    }
    const projectTask = await TaskModel.find(query).lean().exec()
    if (!projectTask) return null;
    return projectTask

  }
  countTask(): Promise<number> {
    const countTask = TaskModel.countDocuments();
    return countTask
  }
  async getPagenationaTask(workspaceId: Types.ObjectId, page: number, limit: number, skip: number): Promise<{
    items: Task[];
    totalItems: number;
  }> {

    //
    const projects = await ProjectModel.findOne({ workspaceId: workspaceId }, { _id: 1 })

    const result = await TaskModel.find({ projectId: projects?._id });

    // END 
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
    const task = await TaskModel.findById(taskId).lean().exec()
    if (!task) return null;
    return new Task({ ...task, id: task._id?.toString() });
  }

  async deleteAttachment(taskId: string, url: string): Promise<Task | null> {
    const task = await TaskModel.findByIdAndUpdate(
      taskId,
      {
        $pull: { attachedURLs: url }
      },
      { new: true }
    );
    if (!task) return null;
    return new Task({ ...task, id: task._id?.toString() });

  }


  async deleteSubTask(taskId: Types.ObjectId, subTask: string): Promise<void> {
    await TaskModel.findByIdAndUpdate(
      taskId,
      {
        $pull: {
          subTask: { title: subTask }
        }
      }
    );
  }
  async updateSubTask(taskId: Types.ObjectId, title: string): Promise<void> {
    await TaskModel.updateOne(
      { _id: taskId, "subTask.title": title },
      [
        {
          $set: {
            subTask: {
              $map: {
                input: "$subTask",
                as: "st",
                in: {
                  $cond: [
                    { $eq: ["$$st.title", title] },
                    {
                      title: "$$st.title",
                      status: {
                        $cond: [
                          { $eq: ["$$st.status", "Completed"] },
                          "Pending",
                          "Completed"
                        ]
                      }
                    },
                    "$$st"
                  ]
                }
              }
            }
          }
        }
      ]
    );
  }
}
