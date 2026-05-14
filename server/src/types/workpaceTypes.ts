import mongoose from "mongoose";
import { ObjectId } from "mongoose";
export interface WorkspaceMembership {
  workspaceId: mongoose.Types.ObjectId;
  role: "Member" | "Admin" | "SuperAdmin";
  permissions: "Member" | "Admin" | "Viewer";
  joinedAt?: Date;
}
export interface Member {
  userId: string;
  title: string;
  permissions?:'Viewer'|'Member'|'Admin'
}
export interface IMember {
  userId: string;
  title: string;
  name:string;
  permissions?:string
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
