import  { Types } from "mongoose";
import { ObjectId } from "mongoose";
export interface WorkspaceMembership {
  workspaceId: Types.ObjectId;
}
export interface Member {
  userId: Types.ObjectId;
  title: string;
  permissions:'Viewer'|'Member'|'Admin',
  role:'Admin'|'Member',
  isBlocked?:boolean,
  isDeleted?:boolean,
  isOnline?:boolean
}
export interface IMember {
  userId: string | Types.ObjectId;
  title: string;
  name:string;
  permissions?:string,
   isBlocked?:boolean,
  isDeleted?:boolean,
  isOnline?:boolean
}
export type workspaceStatus = "Active"|"InActive"|"Suspend"|"Deleted"
export interface WorkspaceProps {
  name: string;
  slug: string;
  role: string;
  ownerId: string|Types.ObjectId;
  members?: Member[];
  status:workspaceStatus;
  storage:workspaceStorage;
  createdAt?: Date;
  _id?: string|ObjectId;
   stripeCustomerId: string;
    currentSubscription: Types.ObjectId|null
}
export type workspaceStorage = 1|5|10|100
