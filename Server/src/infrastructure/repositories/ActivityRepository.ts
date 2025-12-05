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
//   async findActivities(logId: Types.ObjectId): Promise<any> {
//     const userObjectId = new mongoose.Types.ObjectId("68f1157623d1967940381b72");
//      const results  = await UserModel.aggregate([{
//     $match:{_id:userObjectId}
//   },{
//     $project:{
//       workspaceId:{
//         $arrayElemAt:["$workspace",0]
//       }
//     },
//   },
//   {
//     $lookup:{
//       from:"workspaces",
//       localField: "workspaceId",
//        foreignField: "_id",
//         as: "workspace",

//     }
//   },
//   { $unwind: "$workspace" },
//   {
//       $addFields: {
//         totalMembers: { $size: "$workspace.members" },
//       },
//     },
//      {
//       $lookup: {
//         from: "projects",
//         localField: "workspaceId",
//         foreignField: "workspaceId",
//         as: "projects",
//       },
//     },
//     {
//       $addFields: {
//         totalProjects: { $size: "$projects" },
//       },
//     },
//      {
//       $lookup: {
//         from: "tasks",
//         let: { projectIds: "$projects._id" },
//         pipeline: [
//           { $match: { $expr: { $in: ["$projectId", "$$projectIds"] } } },
//           {
//             $group: {
//               _id: "$status",
//               count: { $sum: 1 },
//             },
//           },
//         ],
//         as: "taskStats",
//       },
//     },
// {
//       $project: {
//         _id: 0,
//         totalMembers: 1,
//         totalProjects: 1,
//         taskStats: 1,
//       },
//     },
// ])
// console.log(results,"resultsss")
//     //   const result = await ActivityModel.aggregate([
//     //   {
//     //     $match: { _id: logId }
//     //   },
//     //   {
//     //     $project: {
//     //       _id: 0,
//     //       workspaceActivity: {
//     //         activities: {
//     //           $slice: ["$workspaceActivities"] // last element only
//     //         }
//     //       },
//     //       projectActivity: {
//     //         activities: {
//     //           $slice: ["$projectActivities"]
//     //         }
//     //       },
//     //       userActivity: {
//     //         activities: {
//     //           $slice: ["$userActivities", ]
//     //         }
//     //       }
//     //     }
//     //   }
//     // ]);
//     const result = await ActivityModel.find({ _id: logId }).lean();
//     console.log(result,"Aggregation result")
//     return result;
//   }
//   async addNewProject(
//     projectName: string,
//     creatdBy: string,
//     activityId: string
//   ): Promise<any> {
//     const activityItem = {
//       name: projectName,
//       createdby: creatdBy,
//       message: `New ${projectName} project createdby ${creatdBy}`,
//     };
//     console.log(activityItem, "%activtyReopo");
//     const result = await ActivityModel.updateOne(
//       { _id: activityId },
//       { $push: { projectActivities: activityItem } }
//     );

//     console.log(result, "@resposiv project add");
//   }
//   async inviteMember(userName: string, activityId: string): Promise<any> {
//     const activityItem = {
//       name: userName,

//       message: ` ${userName} accepted invitaion`,
//     };
//     const result = await ActivityModel.updateOne(
//       { _id: activityId },
//       { $push: { userActivities: activityItem } }
//     );
//   }
// async workspceDataCount(userId: string): Promise<any> {
//      const userObjectId = new mongoose.Types.ObjectId(userId);
//  const result  = await UserModel.aggregate([{
//     $match:{_id:userObjectId}
//   },{
//     $project:{
//       workspaceId:{
//         $arrayElemAt:["$workspace",0]
//       }
//     },
//   },
//   {
//     $lookup:{
//       from:"workspaces",
//       localField: "workspaceId",
//        foreignField: "_id",
//         as: "workspace",

//     }
//   },
//   { $unwind: "$workspace" },
//   {
//       $addFields: {
//         totalMembers: { $size: "$workspace.members" },
//       },
//     },
//      {
//       $lookup: {
//         from: "projects",
//         localField: "workspaceId",
//         foreignField: "workspaceId",
//         as: "projects",
//       },
//     },
//     {
//       $addFields: {
//         totalProjects: { $size: "$projects" },
//       },
//     },
//      {
//       $lookup: {
//         from: "tasks",
//         let: { projectIds: "$projects._id" },
//         pipeline: [
//           { $match: { $expr: { $in: ["$projectId", "$$projectIds"] } } },
//           {
//             $group: {
//               _id: "$status",
//               count: { $sum: 1 },
//             },
//           },
//         ],
//         as: "taskStats",
//       },
//     },
// {
//       $project: {
//         _id: 0,
//         totalMembers: 1,
//         totalProjects: 1,
//         taskStats: 1,
//       },
//     },
// ])
// console.log(result)
//  return result[0] || null;
// }





