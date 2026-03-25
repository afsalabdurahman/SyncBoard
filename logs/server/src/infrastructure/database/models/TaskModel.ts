// src/infra/db/models/Task.ts
import mongoose, { model, Schema, Document } from "mongoose";
import { approvalType, commentType, priorityType, statusType } from "../../../types/taskTypes";

export interface TaskDocument extends Document {
  name: string;
  assignedUser: string;
  description: string;
  deadline?: string;
  priority?: priorityType;
  status?: statusType;
  projectId?: string;
  project?: string;
  approvalStatus?: approvalType;
  rejectionMsg?: string;
  embedding?: number[];   // ← 384-dim vector
  comments: commentType[];
  attachedURLs: string[];
  subTask?: { title: string; status: "Pending" | "Completed", estimate: number }[];
}

const TaskSchema = new Schema<TaskDocument>(
  {
    name: { type: String, required: true },
    assignedUser: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"] },
    status: { type: String, enum: ["To Do", "In Progress", "Completed"] },
    projectId: { type: String },
    project: { type: String },
    approvalStatus: { type: String, enum: ["Approved", "Rejected", "Waiting"] },
    rejectionMsg: { type: String },
    embedding: { type: [Number], required: false },
    comments: [
      {
        _id: false,
        name: { type: String, required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        urls: { type: [String], default: [] },
      },
    ],
    attachedURLs: { type: [String] },
    subTask: [
      {
        _id: false,
        title: { type: String },
        status: {
          type: String,
          enum: ["Pending", "Completed"],
          default: "Pending"
        },
        estimate: {
          type: Number,
          default: 2
        }
      }
    ]
  },
  { timestamps: true, collection: "Task" }
);

export const TaskModel = model<TaskDocument>("Task", TaskSchema);