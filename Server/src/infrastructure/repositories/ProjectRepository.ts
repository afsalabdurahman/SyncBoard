import { NotBeforeError } from "jsonwebtoken"
import { Project } from "../../domain/entities/Project"
import {IProjectRepository} from "../../domain/interfaces/repositories/IProjectRepository"
import {ProjectModel} from "../database/models/ProjectModel"
import { NotFoundError } from "../../utils/errors"
import mongoose from "mongoose"

export class ProjectRepository implements IProjectRepository {
async create(dto: Project): Promise<Project | null> {
   const projectData=await ProjectModel.create(dto)
   return projectData
}
async getAllProjects(): Promise<any | null> {
   const projects = await ProjectModel.find()
   return projects
}
async removeAttachment( projectId: string, attachedUrl: string): Promise<void> {
   const isRemove=await ProjectModel.updateOne({_id:projectId},{$pull:{attachedUrl:attachedUrl}})
   
   if(!isRemove) throw new NotFoundError("Attachment not found")

}
async updateProject(projectId: string, merged:any): Promise<boolean> {
console.log(projectId,"@repository")
const objectId: any = new mongoose.Types.ObjectId(projectId.toString());
const update=await ProjectModel.updateOne({_id:objectId},{$set:merged},{upsert:true,new:true,runValidators: true}
)

    console.log(update,"updatedProject")
    return true
 
}
async deleteProject(projectId: string): Promise<void> {
   const objectId: any = new mongoose.Types.ObjectId(projectId.toString());
   await ProjectModel.deleteOne({_id:objectId})
}

}