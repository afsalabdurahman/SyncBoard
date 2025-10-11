import { Workspace } from "../../domain/entities/Workspace";
import { WorkspaceModel } from "../database/models/WorkspaceModel";
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
  ): Promise<any> {
    const data = { userId: userId, title: title };
    let updatedWorkspce = await WorkspaceModel.findOneAndUpdate(
      { slug },
      { $push: { members: data } }
    );
    return updatedWorkspce;
  }
  
  async findbySlug(slug: string): Promise<Workspace | any> {
    
    let workspaceData = await WorkspaceModel.findOne({ slug: slug });
  
 
    return workspaceData
  }
 async addlogId(workspaceId:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>{
    const result= await WorkspaceModel.updateOne({_id:workspaceId},{$set:{logId:logId}},{upsert:true})

return true
  }
}
