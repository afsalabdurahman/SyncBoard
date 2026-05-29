import  { Schema,   } from "mongoose";
import { WorkspaceMembership } from "../../../types/workpaceTypes";
export const workspaceMembershipSchema = new Schema<WorkspaceMembership>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    role: {
      type: String,
      enum: ["Member", "Admin", "SuperAdmin"],
      default: "Member",
    },
    permissions:{
      type:String,
      enum:["Viewer","Admin","Member"],
      default:"Admin"
    },
    title:{
type:String,
default:"Member"
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  
);