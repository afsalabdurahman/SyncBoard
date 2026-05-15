import mongoose, { Schema, Document, ObjectId, Types } from 'mongoose';

import { workspaceStatus,IMember ,workspaceStorage} from '../../../types/workpaceTypes';



export interface WorkspaceDoument extends Document {
  _id: ObjectId; 
  name: string;
  slug: string;
  role:string;
  ownerId:Types.ObjectId,
  createdAt: Date;
  members: IMember[];
  status:workspaceStatus;
  storage:workspaceStorage;
  logId:Schema.Types.ObjectId;
  
}
const MemberSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default:'Member',
    
    required: true,
  },
  name:{
    type:String,
    
  },
  permissions:{
    type:String,
    default:"Admin"
  },
  role:{
    type:String,
    default:'Member'
  },
  isBlocked:{type:Boolean,
    default:false
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
  isOnline:{
    type:Boolean,
    default:false
  }

 
}, )
const WorkspaceSchema: Schema<WorkspaceDoument> = new Schema<WorkspaceDoument>({

  name: {
    type: String,
    required: true,
    trim: true,
  },
 
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
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
