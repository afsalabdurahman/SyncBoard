import { Types } from "mongoose";
import { GetAllReportsResponseDto, listOfAbsuseReposnseDTO, listResponseDto } from "../../application/dto/AbuseDTO";
import { Abuse } from "../../domain/entities/Abuse";
import { IAbuseRepository } from "../../domain/interfaces/repositories/IAbuseRepository";
import { AbuseModel } from "../database/models/AbuseModel";
import { BaseRepository } from "./BaseRepository";
import { stringToMongoObj } from "../../utils/convertMongoObject";
import { ObjectId } from "mongodb";

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
async findListOfReports(page:number,limit:number,skip:number,userid: Types.ObjectId, workspaceid: Types.ObjectId): Promise<listResponseDto|null> {
  
  const list = await AbuseModel.find({userId:userid,workspaceId:workspaceid}).skip(skip).limit(limit).sort({ createdAt: -1 }).lean<Abuse[]>().exec();
if(!list) return null
  const count = await AbuseModel.countDocuments({
  userId: userid,
  workspaceId: workspaceid
});
  
  return {list,count}
}
async serachReport(query: string,workspaceid:Types.ObjectId,userid:Types.ObjectId): Promise<listOfAbsuseReposnseDTO[]> {
  const result = await AbuseModel.find({workspaceId:workspaceid,userId:userid,
  type: { $regex: query, $options: "i" }
}).limit(10).lean<listOfAbsuseReposnseDTO[]>()
console.log(result,"resultssssss")
  return result 
}
}