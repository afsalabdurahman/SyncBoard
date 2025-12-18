import { ISuperAdminRepository } from "../../domain/interfaces/repositories/ISuperAdminRepository";
import { UserModel } from "../database/models/UserModel";
import { WorkspaceModel } from "../database/models/WorkspaceModel";
import { SubscriptionModel } from "../database/models/SuscriptionModel";
import mongoose from "mongoose";
import { TicketModel } from "../database/models/TicketModel";
import { GetAllCountResponseDTO, SubscriptionAggResponseDTO, UserAggResponseDTO, UserDetailsAggResponseDTO, WorkspaceAggResponseDTO } from "../../application/dto/SuperDTO";
import { AbuseModel } from "../database/models/AbuseModel";
export class SuperAdminRepository implements ISuperAdminRepository {

  async getAllCount(): Promise<GetAllCountResponseDTO> {
    const userCount = await UserModel.countDocuments({ role: { $ne: "SuperAdmin" } });

    let workspaceCount = await WorkspaceModel.countDocuments();
    const data = await SubscriptionModel.aggregate([
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace",
          foreignField: "_id",
          as: "workspaceData"
        }
      },
      {
        $unwind: {
          path: "$workspaceData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          workspaceName: "$workspaceData.name",
          subscriptionPlan: "$planKey",
          status: 1,
          updated: "$updatedAt",

          amount: {
            $cond: {
              if: { $eq: ["$planKey", "free"] },
              then: 0,
              else: "$amount"
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          data: { $push: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          data: 1,
          count: 1
        }
      }
    ]).exec();

const abusereportlas= await AbuseModel.find().sort({createdAt:-1}).limit(3)
console.log(abusereportlas,"consoleAbuseRepo++")
    return { data, userCount, workspaceCount,abusereportlas }
  }
  async getAllWorkspace(limit:number,skip:number): Promise<WorkspaceAggResponseDTO[]> {


const totalDocCount = await WorkspaceModel.countDocuments();
    const result = await WorkspaceModel.aggregate([

      {
        $addFields: {
          ownerIdObj: {
            $cond: [
              { $eq: [{ $type: "$ownerId" }, "string"] },
              { $toObjectId: "$ownerId" },
              "$ownerId"
            ]
          }
        }
      },


      {
        $lookup: {
          from: "users",
          localField: "ownerIdObj",
          foreignField: "_id",
          as: "owner"
        }
      },
      { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },


      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "workspace",
          as: "subscription"
        }
      },
      { $unwind: { path: "$subscription", preserveNullAndEmptyArrays: true } },


      {
        $lookup: {
          from: "plans",
          let: { planKey: "$subscription.planKey" },
          pipeline: [
            { $match: { $expr: { $eq: ["$key", "$$planKey"] } } },
            { $project: { priceCents: 1 } }
          ],
          as: "planDetails"
        }
      },
      {
        $addFields: {
          planDetails: { $arrayElemAt: ["$planDetails", 0] }
        }
      },

      {
        $lookup: {
          from: "projects",
          let: { workspaceId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$workspaceId", "$$workspaceId"] } } },
            { $sort: { updatedAt: -1 } },
            { $limit: 1 },
            { $project: { updatedAt: 1 } }
          ],
          as: "latestProject"
        }
      },
      {
        $addFields: {
          lastProjectUpdatedDate: {
            $ifNull: [{ $arrayElemAt: ["$latestProject.updatedAt", 0] }, null]
          }
        }
      },


      {
        $project: {
          _id: 0,
          workspaceId: "$_id",
          workspaceName: "$name",
          workspaceStatus: "$status",
          memberCount: { $size: { $ifNull: ["$members", []] } },
          workspaceCreatedDate: "$createdAt",
          workspaceStorage: "$storage",
          workspaceSlug: "$slug",

          ownerName: "$owner.name",
          ownerEmail: "$owner.email",
          ownerImageUrl: "$owner.imageUrl",

          subscriptionPlan: "$subscription.planKey",
          subscriptionStatus: "$subscription.status",

          monthlyRevenue: {
            $ifNull: ["$planDetails.priceCents", 0]
          },

          lastProjectUpdatedDate: 1
        }
      },
      { $sort: { workspaceCreatedDate: -1 } },
  { $skip: skip },
  { $limit: limit }

    ])
result.push(totalDocCount)
    return result
  }

  async getAllUsers(limit:number,skip:number): Promise<UserAggResponseDTO[]> {
   const totalDocCount = await UserModel.countDocuments();

    const result = await UserModel.aggregate([
      {
        $match: {
          role: { $ne: "superAdmin" }   
        }
      },
      {
        $addFields: {
          status: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$isBlock", true] },
                  { $eq: ["$isDelete", true] }
                ]
              },
              then: "inactive",
              else: "active"
            }
          }
        }
      },
      {
        $unwind: "$workspace"
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace.workspaceId",
          foreignField: "_id",
          as: "workspaceDetails"
        }
      },
      {
        $unwind: "$workspaceDetails"
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "workspaceDetails._id",
          foreignField: "workspace",
          as: "subscriptionDetails"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          imageUrl: 1,
          role: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          "workspaceDetails.name": 1,
          "subscriptionDetails.planKey": 1
        }
      },{ $sort: { workspaceCreatedDate: -1 } },
  { $skip: skip },
  { $limit: limit }
    ]);


result.push(totalDocCount)
    return result;
  }


  async  getUserDetails(userId: string):Promise<UserDetailsAggResponseDTO> {
     let id = new mongoose.Types.ObjectId(userId);
    const result = await UserModel.aggregate([
      {
        $match: {
          _id: id
        }
      },
      {
        $addFields: {
          status: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$isBlock", true] },
                  { $eq: ["$isDelete", true] }
                ]
              },
              then: "inactive",
              else: "active"
            }
          }
        }
      },
      {
        $unwind: "$workspace"
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace.workspaceId",
          foreignField: "_id",
          as: "workspaceDetails"
        }
      },
      {
        $unwind: "$workspaceDetails"
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "workspaceDetails._id",
          foreignField: "workspace",
          as: "subscriptionDetails"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          imageUrl: 1,
          createdAt: 1,
          status: 1,
          "workspaceDetails.name": 1,
          "subscriptionDetails.planKey": 1
        }
      }
    ]);

    return result[0];
  }

  async getSubscription(limit:number,skip:number): Promise<SubscriptionAggResponseDTO[]> {
    const totalDocCount = await SubscriptionModel.countDocuments();
    const result = await WorkspaceModel.aggregate([
      {
        $lookup:{
          
    
      from: "users",
      let: { ownerIdStr: "$ownerId" },   // define a variable from local string field
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", { $toObjectId: "$$ownerIdStr" }]  // convert string to ObjectId
            }
          }
        }
      ],
      as: "userDetails"
    
  
        },
      },
      {
        $unwind:"$userDetails"
      },
      {
        $project:{
          
  workspaceId: "$_id",
  name: 1,
  createdAt: 1,
  userName: "$userDetails.name",
  userEmail: "$userDetails.email"
}
        
      },
      {
        $lookup:{
          
  from: "subscriptions",
  localField: "workspace",
  foreignField: "workspaceId",
  as: "subscriptionDetails"

        }
      },
      {
        $unwind:
          "$subscriptionDetails"
        
      },
      {
        $project:{
          
  workspaceId: 1,
  name: 1,
  createdAt: 1,
  userName: 1,
  userEmail: 1,
  planKey: "$subscriptionDetails.planKey",
  subscriptionStatus:
    "$subscriptionDetails.status"
}
        
      },
     {
      $lookup:{
        
  from: "plans",
  localField: "planKey",
  foreignField: "key",
  as: "planDetails"

      }
     },
     {
      $unwind:"$planDetails"
     },
     {
      $project:{
        
  workspaceId: 1,
  name: 1,
  createdAt: 1,
  userName: 1,
  userEmail: 1,
  planKey: 1,
  subscriptionStatus: 1,
  priceCents: "$planDetails.priceCents"

      }
     },{ $sort: { workspaceCreatedDate: -1 } },
  { $skip: skip },
  { $limit: limit }

    ])
  result.push(totalDocCount)
    return result;
  }
  
async getAllTickets(): Promise<any> {
  const result= await TicketModel.find()
  console.log(result,"reslt")
  return result
}

}