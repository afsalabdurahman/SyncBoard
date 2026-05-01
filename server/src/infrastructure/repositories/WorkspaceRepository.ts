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
   
    const workspace = await WorkspaceModel.findById(id).lean().exec();
     
           if (!workspace) return null;
           return new Workspace({ ...workspace, _id: workspace._id?.toString() });


  
  }

  async addMemberToWorkspace(
    slug: string,
    userId: string,
    title: string
  ): Promise<Workspace | null> {
    const data = { userId: userId, title: title };
    const updatedWorkspce = await WorkspaceModel.findOneAndUpdate(
      { slug },
      { $push: { members: data } },{new:true}
    ).lean().exec()
     if (!updatedWorkspce) return null;
           return new Workspace({ ...updatedWorkspce, _id: updatedWorkspce._id?.toString() });

  }
  
  async findbySlug(slug: string): Promise<Workspace | null> {
    
    const workspace = await WorkspaceModel.findOne({ slug: slug }).lean().exec();
  
 
           if (!workspace) return null;
           return new Workspace({ ...workspace, _id: workspace._id?.toString() });
  }
 async addlogId(workspaceId:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>{
    await WorkspaceModel.updateOne({_id:workspaceId},{$set:{logId:logId}},{upsert:true})

return true
  }
  async updateWorkspaceDate(workspaceId: string, merge: Record<string,string>): Promise<Workspace | null> {
    const objectId = new mongoose.Types.ObjectId(workspaceId); 
    const updatedWorkspce = await WorkspaceModel.findOneAndUpdate(
  { _id: objectId },
  { $set: merge },
  {
    new: true,            
    upsert: true,         
    runValidators: true,  
  }
);
 if (!updatedWorkspce) return null;
           return new Workspace({ ...updatedWorkspce, _id: updatedWorkspce._id?.toString() });

  }
  async findAll(): Promise<WorkspaceDoument[]> {
    const workspaceData= await WorkspaceModel.find({}).lean().exec()
    return workspaceData 
  }
  
}
