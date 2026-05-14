import mongoose, { Schema, Document, ObjectId } from 'mongoose';

import { workspaceStatus,IMember ,workspaceStorage} from '../../../types/workpaceTypes';


export interface WorkspaceDoument extends Document {
  _id: ObjectId; 
  name: string;
  slug: string;
  role:string;
  ownerId: string;
  createdAt: Date;
  members: IMember[];
  status:workspaceStatus;
  storage:workspaceStorage;
  logId:Schema.Types.ObjectId;
  
}
const MemberSchema: Schema = new Schema({
  userId: {
    type: String, 
    required: true,
  },
  title: {
    type: String,
    
    required: true,
  },
  name:{
    type:String,
    
  },
  permissions:{
    type:String
  },
  email:{
      type: String,
    }
}, )
const WorkspaceSchema: Schema<WorkspaceDoument> = new Schema<WorkspaceDoument>({

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
    default:"active"
  },
  storage:{
    type:Number,
    default:1
  },
  logId:{type:Schema.Types.ObjectId}

});

export const WorkspaceModel = mongoose.model<WorkspaceDoument>('Workspace', WorkspaceSchema);
