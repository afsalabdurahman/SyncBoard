import mongoose, { model, Schema, Document } from "mongoose";
import { PriorityTypes, StatusTypes } from "../../../types/projectTypes"
export interface ProjectDocument extends Document {
  name: string;
  assignedUsers: string[];
  clientName: string;
  description: string;
  attachedUrl?: string[];
  deadline?: Date;
  priority?: PriorityTypes;
  status?: StatusTypes;
  projectAdminId: Schema.Types.ObjectId;
  workspaceId: Schema.Types.ObjectId;

}


const ProjectSchema = new Schema<ProjectDocument>({
  name: { type: String, required: true },
  assignedUsers: { type: [String], required: true },
  clientName: { type: String, required: true },
  description: { type: String, required: true },
  attachedUrl: { type: [String] },
  deadline: { type: Date },
  priority: { type: String, enum: ["Low", "Medium", "High"] },
  status: { type: String, enum: ["Planning", "In Progress", "Completed", "On Hold"] },
  projectAdminId: { type: Schema.Types.ObjectId, ref: "User" },
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' }

}, { timestamps: true })

export const ProjectModel = model<ProjectDocument>("Project", ProjectSchema);
