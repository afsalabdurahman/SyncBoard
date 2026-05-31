import mongoose, { Schema, Document, ObjectId, Types } from 'mongoose';

import { workspaceStatus,IMember ,workspaceStorage, Member} from '../../../types/workpaceTypes';



export interface WorkspaceDoument extends Document {
  _id: ObjectId; 
  name: string;
  slug: string;
  role:string;
  ownerId:Types.ObjectId,
  createdAt: Date;
  members: Member[];
  status:workspaceStatus;
  storage:workspaceStorage;
  logId:Schema.Types.ObjectId;
  currentSubscription:Types.ObjectId,
  stripeCustomerId:string
  
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
  permissions:{
    type:String,
    default:"Viewer"
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
  },
  

 
}, { _id: false,timestamps:true })
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
    default:"Active"
  },
  storage:{
    type:Number,
    default:1
  },
 currentSubscription:{
  type:Schema.Types.ObjectId,
  ref:'Subscription'
 },
 stripeCustomerId:{
  type:String
 }

});

export const WorkspaceModel = mongoose.model<WorkspaceDoument>('Workspace', WorkspaceSchema);
