import { Project } from "../../domain/entities/Project"
import { IProjectRepository } from "../../domain/interfaces/repositories/IProjectRepository"
import { ProjectModel, ProjectDocument } from "../database/models/ProjectModel"
import { NotFoundError } from "../../utils/errors"
import { BaseRepository } from "./BaseRepository"
import mongoose, { Types } from "mongoose"
import { ProjectNamesAndId, ProjectRepositoryDTO } from "../../application/dto/ProjectDTOs"
import { stringToMongoObj } from "../../utils/convertMongoObject"


export class ProjectRepository extends BaseRepository<Project,ProjectDocument> implements IProjectRepository {
   constructor() {
      super(ProjectModel)
   }


 async getAllProjects(workspaceId:Types.ObjectId): Promise<ProjectRepositoryDTO[]> {
  const projects = await ProjectModel
    .find({workspaceId:workspaceId})
    .sort({ createdAt: -1 })
    .lean<ProjectRepositoryDTO[]>()  
    .exec();

  return projects; 
}
   async removeAttachment(projectId: string, attachedUrl: string): Promise<void> {
      const isRemove = await ProjectModel.updateOne({ _id: projectId }, { $pull: { attachedUrl: attachedUrl } })

      if (!isRemove) throw new NotFoundError("Attachment not found")

   }

  async updateProject(projectId: string, merged: Record<string,string>): Promise<Project | null> {
  const objectId = new mongoose.Types.ObjectId(projectId);


  const updatedProject = await ProjectModel.findByIdAndUpdate(
    objectId,
    { $set: merged },
    { new: true, upsert: true, runValidators: true }
  ).exec()

    
       if (!updatedProject) return null;
   if (!updatedProject) return null;

const raw = updatedProject.toObject() as ProjectDocument;

return new Project({
  _id: raw._id?.toString(),
  name: raw.name,
  description: raw.description,
  assignedUsers: raw.assignedUsers,
  deadline: raw.deadline,
  status: raw.status,
  priority: raw.priority,
  clientName: raw.clientName,
  projectAdminId: raw.projectAdminId?.toString(),
  workspaceId: raw.workspaceId?.toString(),
  attachedUrl: raw.attachedUrl,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

}

   async deleteProject(projectId: string): Promise<void> {
      const objectId = new mongoose.Types.ObjectId(projectId.toString());
      await ProjectModel.deleteOne({ _id: objectId })
   }

   async countProject(): Promise<number> {
      const count = await ProjectModel.countDocuments();
      return count
   }

   async getPagenationProjects(workspaceId:string,page: number, limit: number, skip: number): Promise<{items:ProjectRepositoryDTO[],totalItems:number}> {
     const totalItems = await ProjectModel.countDocuments({ workspaceId });

      const items = await ProjectModel.find({workspaceId:workspaceId})
         .skip(skip)
         .limit(limit)
         .sort({ createdAt: -1 }).lean<ProjectRepositoryDTO[]>().exec()
      return { items, totalItems }
   }
   async findProjectbyAdminId(id: string): Promise<Project[]> {
      const mongoID=stringToMongoObj(id)
      const projects = await ProjectModel.find({projectAdminId:mongoID}).lean<Project[]>().exec()
      
      return projects
   }
async deleteAttachedURl(projectId: Types.ObjectId, url: string): Promise<void> {
   await ProjectModel.findByIdAndUpdate(
    projectId,
    {
      $pull: { attachedUrl: url }
    },
    { new: true }
  );
}
async pushToAttachments(urls: string[], projectId: string): Promise<void> {
  await ProjectModel.findByIdAndUpdate(
    projectId,
    {
      $push: {
        attachedUrl: { $each: urls }   
      }
    },
    { 
      new: true,           
      runValidators: true  
    }
  );
}
async AllprojectNames(
  workspaceId: Types.ObjectId
): Promise<ProjectNamesAndId[] | null> {
  const projectNames = await ProjectModel.find(
    { workspaceId },
    { name: 1, _id: 1 }
  ).lean<ProjectNamesAndId[]>();

  return projectNames.length ? projectNames : null;
}
}