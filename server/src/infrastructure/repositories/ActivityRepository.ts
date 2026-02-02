import { Types } from "mongoose";
import { Activities } from "../../domain/entities/Activities";
import { IActivityRepository } from "../../domain/interfaces/repositories/IActivityRepository";
import {ActivityModel} from "../database/models/ActivityModel"
import mongoose from "mongoose";
import { resourceLimits } from "worker_threads";
import { UserModel } from "../database/models/UserModel";
import { WorkspaceModel } from "../database/models/WorkspaceModel";
import { TaskModel } from "../database/models/TaskModel";
import { ProjectModel } from "../database/models/ProjectModel";
import { SubscriptionModel } from "../database/models/SuscriptionModel";
import { ActivitiesResponseDTO } from "../../application/dto/ActivityDTO";


export class ActivityRepository implements IActivityRepository {
  async createActivity(data: Activities): Promise<void> {
       const savedData = await ActivityModel.create(data);
   }
  
  async allActivitiesInWorkspace(workspaceId: Types.ObjectId): Promise<ActivitiesResponseDTO[] | null> {
    const activities  = await ActivityModel.aggregate([
  {
    $match: {
      workspaceId: workspaceId
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "createdBy",
      foreignField: "_id",
      as: "userDetails"
    }
  },
  {
    $unwind: "$userDetails"
  },
  {
    $project: {
      _id: 0,
      userName: "$userDetails.name",
      activityType: 1,
      logMsg: 1,
      createdAt: 1
    }
  }
]);
    return activities
  }
  }





