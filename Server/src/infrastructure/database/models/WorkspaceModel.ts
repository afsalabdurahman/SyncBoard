import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { workspaceStatus, workspaceStorage } from '../../../domain/entities/Workspace';
import { string } from 'zod';
export interface IMember {
  userId: string;
  title: string;
  name:string;
}
export interface IWorkspace extends Document {
  _id: ObjectId; 
  name: string;
  slug: string;
  role:string;
  ownerId: string;
  createdAt: Date;
  members: IMember[];
  status:workspaceStatus;
  storage:workspaceStorage;
  logId:Schema.Types.ObjectId
}
const MemberSchema: Schema = new Schema({
  userId: {
    type: String, // or Schema.Types.ObjectId if referencing User
    required: true,
  },
  title: {
    type: String,
    
    required: true,
  },
  name:{
    type:String,
    
  },
  email:{
      type: String,
    }
}, )
const WorkspaceSchema: Schema<IWorkspace> = new Schema<IWorkspace>({

  name: {
    type: String,
    required: true,
    trim: true,
  },
  role:{
type:String
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  ownerId: {
    type: String,
    required: true,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  members: {
    type: [MemberSchema],
    default: [],
  },
  status:{
    type:String,
    default:"Active"
  },
  storage:{
    type:Number,
    default:1
  },
  logId:{type:Schema.Types.ObjectId}

});

export const WorkspaceModel = mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);
