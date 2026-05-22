import mongoose, { Schema, model, Document, Types } from "mongoose";
import { Message, TicketStatus } from "../../../types/tiketTypes";

const messageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    sender: { type: String, enum: ["admin", "super_admin"] },
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }  
);


export interface TicketDocument extends Document{
  title: string;
  SLno:string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: Date;
  updatedAt: Date;
  category:string;
  messages: Message[];
  workspaceId:Types.ObjectId;
  userId:Types.ObjectId;
}
const TicketSchema = new Schema<TicketDocument>(
  {
    SLno:{type:String},
    title: { type: String, required: true },
    description: { type: String },
    status: { 
      type: String, 
      enum: ["open", "in_progress", "resolved", "reopened"],
      default: "open"
    },
    priority: { 
      type: String, 
      enum: ["low", "medium", "high", "critical"], 
      default: "low" 
    },
    category: { type: String },
    messages: {
      type: [messageSchema],
      default: []
    },
    workspaceId:{
      type:Schema.Types.ObjectId,
      required:true,
      ref:"Workspace"
    },
    userId:{
      type:Schema.Types.ObjectId,
      required:true,
      ref:"User"
    }
  },

  { timestamps: true }
);




export const TicketModel = model<TicketDocument>("Ticket", TicketSchema);
