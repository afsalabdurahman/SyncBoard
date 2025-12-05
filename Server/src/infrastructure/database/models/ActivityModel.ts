
import mongoose, { Schema, Document, Types } from "mongoose";
import { ActivityLogMessage, ActivityTypes } from "../../../types/activityTypes";

export interface IActivityDocument extends Document {
  workspaceId: Types.ObjectId;
  activityType: ActivityTypes;
  logMsg: ActivityLogMessage;
  createdBy: Types.ObjectId;      
  createdAt?: Date;
  updatedAt?: Date;
}


const ActivitySchema = new Schema<IActivityDocument>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      enum: ["workspace", "project", "user","task"],
      index: true,
    },
    logMsg: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    
  }
);

// Compound indexes for common queries
// ActivitySchema.index({ workspaceId: 1, createdAt: -1 });
// ActivitySchema.index({ projectId: 1, createdAt: -1 });
// ActivitySchema.index({ userId: 1, createdAt: -1 });

export const ActivityModel = mongoose.model<IActivityDocument>(
  "Activity",
  ActivitySchema
);