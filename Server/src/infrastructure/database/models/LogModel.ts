import { Schema, model, Document, Types } from "mongoose";
import { ActivityType } from "../../../types/activityTypes";


export interface ActivityDocument extends Document {
  workspaceId?: Types.ObjectId;
  projectId?: Types.ObjectId;
  taskId?: Types.ObjectId;
  performedBy?: Types.ObjectId; 
  affectedUser?: Types.ObjectId; 
  type: ActivityType;
  message: string; 
  metadata?: Record<string, any>; 
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<ActivityDocument>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    performedBy: { type: Schema.Types.ObjectId, ref: "User" },
    affectedUser: { type: Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
      index: true,
    },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);


ActivitySchema.index({ workspaceId: 1, createdAt: -1 });
ActivitySchema.index({ type: 1, createdAt: -1 });

export const ActivityModel = model<ActivityDocument>("Activity", ActivitySchema);
