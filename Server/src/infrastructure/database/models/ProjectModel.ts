import mongoose,{ model, Schema,Document } from "mongoose";
import {PriorityTypes,StatusTypes,Project} from "../../../domain/entities/Project"

export interface IProject extends Document {
  name: string;
  assignedUsers: string[];
  clientName: string;
  description: string;
  attachedUrl?: string[];
  deadline?: Date;
  priority?: PriorityTypes;
  status?: StatusTypes;

}


const ProjectSchema=new Schema<IProject>({
name:{type:String,required:true},
assignedUsers:{type:[String],required:true},
clientName:{type:String,required:true},
description:{type:String,required:true},
attachedUrl:{type:[String]},
deadline:{type:Date},
priority:{type:String,enum:["Low","Medium","High"]},
status:{type:String,enum:["Planning" , "In Progress" , "Completed" , "On Hold"]}

},{timestamps:true})

export const ProjectModel = model<IProject>("Project", ProjectSchema);
