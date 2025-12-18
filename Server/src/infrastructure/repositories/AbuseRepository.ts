import { Types } from "mongoose";
import { GetAllReportsResponseDto } from "../../application/dto/AbuseDTO";
import { Abuse } from "../../domain/entities/Abuse";
import { IAbuseRepository } from "../../domain/interfaces/repositories/IAbuseRepository";
import { AbuseModel } from "../database/models/AbuseModel";
import { BaseRepository } from "./BaseRepository";
export class AbuseRepository extends BaseRepository <Abuse> implements IAbuseRepository  {
   constructor(){
    super(AbuseModel)
   }
   
   async getAllReports(page:number,limit:number,skip:number): Promise<GetAllReportsResponseDto> {
    const count = await AbuseModel.countDocuments()
  const reports = await AbuseModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $unwind: "$userDetails"
    },
    {
      $addFields: {
        userName: "$userDetails.name"
      }
    },
    {
      $project: {
        severity: 1,
        createdAt: 1,
        __v: 1,
        description: 1,
        type: 1,
        userId: 1,
        workspaceId: 1,
        updatedAt: 1,
        _id: 1,
        userName: 1,
        status:1 // comes from $addFields
      }
    }
  ]).skip(skip)
         .limit(limit)
         .sort({ createdAt: -1 });

  return {reports,count};
}
async updateReport(id: Types.ObjectId, status: string): Promise<void> {
 await AbuseModel.findByIdAndUpdate(
  id,
  { $set: { status: status } },
 
);


  
}
}