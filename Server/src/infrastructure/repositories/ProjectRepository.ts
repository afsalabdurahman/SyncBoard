import { NotBeforeError } from "jsonwebtoken"
import { Project } from "../../domain/entities/Project"
import { IProjectRepository } from "../../domain/interfaces/repositories/IProjectRepository"
import { ProjectModel } from "../database/models/ProjectModel"
import { NotFoundError } from "../../utils/errors"
import { BaseRepository } from "./BaseRepository"
import mongoose from "mongoose"

export class ProjectRepository extends BaseRepository<Project> implements IProjectRepository {
   constructor() {
      super(ProjectModel)
   }

   // async create(dto: Project): Promise<Project | null> {
   //    const projectData=await ProjectModel.create(dto)
   //    return projectData
   // }
   async getAllProjects(): Promise<any | null> {
      const projects = await ProjectModel.find().sort({ createdAt: -1 });
      console.log(projects, "projects")
      return projects
   }
   async removeAttachment(projectId: string, attachedUrl: string): Promise<void> {
      const isRemove = await ProjectModel.updateOne({ _id: projectId }, { $pull: { attachedUrl: attachedUrl } })

      if (!isRemove) throw new NotFoundError("Attachment not found")

   }

  async updateProject(projectId: string, merged: any): Promise<Project | null> {
  const objectId = new mongoose.Types.ObjectId(projectId);
  const updatedProject = await ProjectModel.findByIdAndUpdate(
    objectId,
    { $set: merged },
    { new: true, upsert: true, runValidators: true }
  )

  return updatedProject as Project;
}

   async deleteProject(projectId: string): Promise<void> {
      const objectId: any = new mongoose.Types.ObjectId(projectId.toString());
      await ProjectModel.deleteOne({ _id: objectId })
   }

   async countProject(): Promise<any> {
      const count = await ProjectModel.countDocuments();
      return count
   }

   async getPagenationProjects(page: number, limit: number, skip: number): Promise<any> {
      const totalItems = await ProjectModel.countDocuments();
      const items = await ProjectModel.find()
         .skip(skip)
         .limit(limit)
         .sort({ createdAt: -1 });
      return { items, totalItems }
   }
}