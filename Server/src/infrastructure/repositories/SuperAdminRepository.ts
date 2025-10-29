import { ISuperAdminRepository } from "../../domain/interfaces/repositories/ISuperAdminRepository";
import { UserModel } from "../database/models/UserModel";
import { WorkspaceModel } from "../database/models/WorkspaceModel";
import { SubscriptionModel } from "../database/models/SuscriptionModel";
export class SuperAdminRepository implements ISuperAdminRepository {

    async getAllCount(): Promise<any> {
      const userCount = await UserModel.countDocuments({ role: { $ne: "SuperAdmin" } });

        let workspaceCount = await WorkspaceModel.countDocuments();
const data =await SubscriptionModel.aggregate([
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

  
return {data,userCount,workspaceCount}   
}
}