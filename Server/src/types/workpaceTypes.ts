import mongoose from "mongoose";
import { ObjectId } from "mongoose";
export interface WorkspaceMembership {
  workspaceId: mongoose.Types.ObjectId;
  role: "Member" | "Admin" | "SuperAdmin";
  joinedAt?: Date;
}
export interface Member {
  userId: string;
  title: string;
}
export interface IMember {
  userId: string;
  title: string;
  name:string;
}
export type workspaceStatus = "Active"|"InActive"|"Suspended"|"Deleted"
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
