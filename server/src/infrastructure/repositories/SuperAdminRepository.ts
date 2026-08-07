import { ISuperAdminRepository } from "../../domain/interfaces/repositories/ISuperAdminRepository";
import { UserModel } from "../database/models/UserModel";
import { WorkspaceModel } from "../database/models/WorkspaceModel";
import { SubscriptionModel } from "../database/models/SuscriptionModel";
import mongoose, { Types } from "mongoose";
import { TicketDocument, TicketModel } from "../database/models/TicketModel";
import { GetAllCountResponseDTO, RevenuChartReponseDTO, SubscriptionAggResponseDTO, SuperUserResponseDto, UserAggResponseDTO, UserGrowthChartReponseDTO, WorkspaceAggResponseDTO } from "../../application/dto/SuperDTO";
import { AbuseModel } from "../database/models/AbuseModel";
import { PlanDocument, PlanModel } from "../database/models/PlanModel";
import { PlanRequestDTO } from "../../application/dto/PlanDTO";
export class SuperAdminRepository implements ISuperAdminRepository {

  async getAllCount(): Promise<GetAllCountResponseDTO> {
    const userCount = await UserModel.countDocuments({ role: { $ne: "SuperAdmin" } });

    const workspaceCount = await WorkspaceModel.countDocuments();
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

  async getAllUsers(limit:number,skip:number): Promise<UserAggResponseDTO> {
   const totalDocCount = await UserModel.countDocuments();

   const result = await UserModel.aggregate([
  {
    $match: {
      role: { $ne: "SuperAdmin" }
    }
  },
  {
    $project: {
      _id: { $toString: "$_id" }, // optional: return string id
      name: 1,
      email: 1,
      imageUrl: 1
    }
  },
  {
    $sort: { createdAt: -1 }
  },
  {
    $skip: skip
  },
  {
    $limit: limit
  }
]);



    return {userList:result,totalCount:totalDocCount};
  }


  async  getUserDetails(userId: string):Promise<SuperUserResponseDto> {
     const id = new mongoose.Types.ObjectId(userId);
const user = await UserModel.findById(id).populate({
  path: "workspace",
  populate: {
    path: "members.userId",
    match: { _id: id },
    select: "name email",
  },
});

return user as unknown as SuperUserResponseDto

  }

  async getSubscription(limit:number,skip:number): Promise<SubscriptionAggResponseDTO> {
    const totalDocCount = await SubscriptionModel.countDocuments();
    const result = await WorkspaceModel.aggregate([
      {
        $lookup:{
          
    
      from: "users",
      let: { ownerIdStr: "$ownerId" },  
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", { $toObjectId: "$$ownerIdStr" }]  
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
  history: "$subscriptionDetails.history",
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
  history:1,
  subscriptionStatus: 1,
  priceCents: "$planDetails.priceCents"

      }
     },{ $sort: { workspaceCreatedDate: -1 } },
  { $skip: skip },
  { $limit: limit }

    ])
    return {subscriptions:result,totalDocCount:totalDocCount};
  }
  
async getAllTickets(): Promise<TicketDocument[]> {
  const result= await TicketModel.find().lean().exec()

  return result
}

async getAllPlans(): Promise<PlanDocument[]> {
   const plans = await PlanModel.find().lean().exec();
   return plans
}
async createPlan(input: PlanRequestDTO): Promise<void> {
  await PlanModel.create(input)
}
async updatePlan(input: PlanRequestDTO,id:Types.ObjectId): Promise<void> {
  await PlanModel.findByIdAndUpdate(id,{
    $set:{
      name:input.name,
      key:input.key,
      priceCents:input.priceCents,
      billingInterval:input.billingInterval,
      features:input.features,
      stripePriceId:input.stripePriceId,
      description:input.description,
      status:input.status,
    },
  },
    {
      new:true
    }
  )
}
async getRevenueChart(): Promise<RevenuChartReponseDTO[] | null> {
 const result =await SubscriptionModel.aggregate([
  // 1. Unwind history array
  {
    $unwind: "$history"
  },

  // 2. Only consider paid records (optional but recommended)
  {
    $match: {
      "history.status": "paid"
    }
  },

  // 3. Add planName based on amount
  {
    $addFields: {
      planName: {
        $switch: {
          branches: [
            { case: { $eq: ["$history.amount", 1000] }, then: "basic" },
            { case: { $eq: ["$history.amount", 2000] }, then: "pro" },
            { case: { $eq: ["$history.amount", 5000] }, then: "enterprise" }
          ],
          default: "unknown"
        }
      }
    }
  },

  // 4. Group by planName and calculate total revenue
  {
    $group: {
      _id: "$planName",
      totalRevenue: { $sum: "$history.amount" }
    }
  },

  // 5. Format output
  {
    $project: {
      _id: 0,
      planName: "$_id",
      totalRevenue: 1
    }
  }
]);
return result
}
getUserGrowth(): Promise<UserGrowthChartReponseDTO[] | null> {
const userGrowth=UserModel.aggregate([
  // ─── STEP 1: Project needed fields ─────────────────────
  {
    $project: {
      createdMonth: { $month: "$createdAt" },
      createdYear: { $year: "$createdAt" },

      churnMonth: {
        $cond: [
          { $or: ["$isBlocked", "$isDeleted"] },
          { $month: "$updatedAt" },
          null,
        ],
      },
      churnYear: {
        $cond: [
          { $or: ["$isBlocked", "$isDeleted"] },
          { $year: "$updatedAt" },
          null,
        ],
      },
    },
  },

  // ─── STEP 2: FACET (parallel pipelines) ─────────────────
  {
    $facet: {
      // ✅ NEW USERS
      newUsers: [
        {
          $group: {
            _id: {
              year: "$createdYear",
              month: "$createdMonth",
            },
            count: { $sum: 1 },
          },
        },
      ],

      // ✅ CHURN USERS
      churned: [
        {
          $match: {
            churnMonth: { $ne: null },
          },
        },
        {
          $group: {
            _id: {
              year: "$churnYear",
              month: "$churnMonth",
            },
            count: { $sum: 1 },
          },
        },
      ],
    },
  },

  // ─── STEP 3: Merge both arrays ──────────────────────────
  {
    $project: {
      combined: {
        $map: {
          input: "$newUsers",
          as: "n",
          in: {
            year: "$$n._id.year",
            month: "$$n._id.month",
            newUsers: "$$n.count",
            churned: {
              $let: {
                vars: {
                  match: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$churned",
                          as: "c",
                          cond: {
                            $and: [
                              { $eq: ["$$c._id.month", "$$n._id.month"] },
                              { $eq: ["$$c._id.year", "$$n._id.year"] },
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: { $ifNull: ["$$match.count", 0] },
              },
            },
          },
        },
      },
    },
  },

  // ─── STEP 4: unwind for sorting ─────────────────────────
  { $unwind: "$combined" },
  { $replaceRoot: { newRoot: "$combined" } },

  // ─── STEP 5: sort by time ───────────────────────────────
  { $sort: { year: 1, month: 1 } },

  // ─── STEP 6: month name + running total ─────────────────
  {
    $setWindowFields: {
      sortBy: { year: 1, month: 1 },
      output: {
        totalUsers: {
          $sum: {
            $subtract: ["$newUsers", "$churned"],
          },
          window: {
            documents: ["unbounded", "current"],
          },
        },
      },
    },
  },

  // ─── STEP 7: format output ──────────────────────────────
  {
    $project: {
      _id: 0,
      month: {
        $arrayElemAt: [
          [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          "$month",
        ],
      },
      totalUsers: 1,
      newUsers: 1,
      churned: 1,
    },
  },
]);
return userGrowth
}
}