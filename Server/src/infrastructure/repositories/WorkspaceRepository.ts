import { Workspace } from "../../domain/entities/Workspace";
import { WorkspaceDoument, WorkspaceModel } from "../database/models/WorkspaceModel";
import { IWorkspaceRepository } from "../../domain/interfaces/repositories/IWorkspaceRepository";
import { injectable } from "tsyringe";
import { Types } from "mongoose";
import mongoose from "mongoose";

@injectable()
export class WorkspaceRepository implements IWorkspaceRepository {
  async create(workspaceEntity: Workspace): Promise<Workspace|null> {
     const workspace =await WorkspaceModel.create(workspaceEntity)
     return workspace.toObject() as Workspace??null

  }

  async findByObjectId(id: Types.ObjectId): Promise<Workspace | null> {
   
    let dbData = await WorkspaceModel.findById(id);


    return dbData;
  }

  async addMemberToWorkspace(
    slug: string,
    userId: string,
    role: string,
    name: string,
    email: string,
    title: string
  ): Promise<Workspace> {
    const data = { userId: userId, title: title };
    let updatedWorkspce = await WorkspaceModel.findOneAndUpdate(
      { slug },
      { $push: { members: data } }
    );
    return updatedWorkspce as Workspace;
  }
  
  async findbySlug(slug: string): Promise<Workspace | null> {
    
    let workspaceData = await WorkspaceModel.findOne({ slug: slug });
  
 
    return workspaceData
  }
 async addlogId(workspaceId:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>{
    const result= await WorkspaceModel.updateOne({_id:workspaceId},{$set:{logId:logId}},{upsert:true})

return true
  }
  async updateWorkspaceDate(workspaceId: string, merge: any): Promise<Workspace> {
    console.log(workspaceId,merge)
    const objectId = new mongoose.Types.ObjectId(workspaceId); 
    const updated = await WorkspaceModel.findOneAndUpdate(
  { _id: objectId },
  { $set: merge },
  {
    new: true,            
    upsert: true,         
    runValidators: true,  
  }
);
console.log(updated)
return updated
  }
  async findAll(): Promise<Workspace[]> {
    const workspaceData= await WorkspaceModel.find({})
    return workspaceData 
  }
  
}
