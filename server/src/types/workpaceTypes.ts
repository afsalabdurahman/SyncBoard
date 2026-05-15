import mongoose, { Types } from "mongoose";
import { ObjectId } from "mongoose";
export interface WorkspaceMembership {
  workspaceId: mongoose.Types.ObjectId;
  role: "Member" | "Admin" | "SuperAdmin";
  permissions: "Member" | "Admin" | "Viewer";
  joinedAt?: Date;
}
export interface Member {
  userId: string|Types.ObjectId;
  title: string;
  permissions?:'Viewer'|'Member'|'Admin',
  role?:'Admin'|'Member',
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
export type workspaceStatus = "active"|"InActive"|"suspend"|"Deleted"
export interface WorkspaceProps {
  name: string;
  slug: string;
  role: string;
  ownerId: string;
  members?: Member[];
  status:workspaceStatus;
  storage:workspaceStorage;
  createdAt?: Date;
  _id?: string|ObjectId;
}
export type workspaceStorage = 1|5|10|100
