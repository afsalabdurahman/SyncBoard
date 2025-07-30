import mongoose,{ model, Schema,Document } from "mongoose";
import { Task,priorityType,statusType } from "../../../domain/entities/Task";
export interface ITask extends Document {
  name: string;
  assignedUser: string;
  description: string;
  deadline?: string;
  priority?: priorityType;
  status?: statusType;
  projectId?:string;
  project?:string;

}

const TaskSchema = new Schema<ITask>({
name:{type:String,required:true},
assignedUser:{type:String,required:true},
description:{type:String,required:true},
deadline:{type:String},
priority:{type:String,enum:["Low","Medium","High"]},
status:{type:String,enum:["To Do" , "In Progress" , "Completed" , ]},
projectId:{type:String},
project:{type:String},
},{timestamps:true})

export const TaskModel = model<ITask>("Task", TaskSchema);