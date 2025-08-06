import { Types } from "mongoose";
import { Activities } from "../../domain/entities/Activities";
import { IActivityRepository } from "../../domain/interfaces/repositories/IActivityRepository";
import { ActivityModel } from "../database/models/ActivityModel";
import mongoose from "mongoose";
import { resourceLimits } from "worker_threads";
export class ActivityRepository implements IActivityRepository {
  async createActivity(data: any): Promise<any | null> {
    console.log(data);
    const savedData = await ActivityModel.create(data);
    console.log(savedData, "saved da");
    return savedData;
  }
  async findActivities(logId: Types.ObjectId): Promise<any> {
    //   const result = await ActivityModel.aggregate([
    //   {
    //     $match: { _id: logId }
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       workspaceActivity: {
    //         activities: {
    //           $slice: ["$workspaceActivities"] // last element only
    //         }
    //       },
    //       projectActivity: {
    //         activities: {
    //           $slice: ["$projectActivities"]
    //         }
    //       },
    //       userActivity: {
    //         activities: {
    //           $slice: ["$userActivities", ]
    //         }
    //       }
    //     }
    //   }
    // ]);
    const result = await ActivityModel.find({ _id: logId }).lean();
    console.log(result,"Aggregation result")
    return result;
  }
  async addNewProject(
    projectName: string,
    creatdBy: string,
    activityId: string
  ): Promise<any> {
    const activityItem = {
      name: projectName,
      createdby: creatdBy,
      message: `New ${projectName} project createdby ${creatdBy}`,
    };
    console.log(activityItem, "%activtyReopo");
    const result = await ActivityModel.updateOne(
      { _id: activityId },
      { $push: { projectActivities: activityItem } }
    );

    console.log(result, "@resposiv project add");
  }
  async inviteMember(userName: string, activityId: string): Promise<any> {
    const activityItem = {
      name: userName,

      message: ` ${userName} accepted invitaion`,
    };
    const result = await ActivityModel.updateOne(
      { _id: activityId },
      { $push: { userActivities: activityItem } }
    );
  }
}
