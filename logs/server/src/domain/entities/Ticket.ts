import { Types } from "mongoose";
import { Message, TicketStatus } from "../../types/tiketTypes";
import { ObjectId } from "mongodb";
export class Ticket {
  _id?: string| Types.ObjectId|ObjectId;
  SLno:string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high" | "critical";
  workspaceId: string|Types.ObjectId;
  userId: string|Types.ObjectId;
  category: string;
  createdAt: Date|string;
  updatedAt: Date|string;
  messages?: Message[];

  constructor(params: {
    _id?: string| Types.ObjectId;
    SLno:string;
    title: string;
    description: string;
    status: TicketStatus;
    priority?: "low" | "medium" | "high" | "critical";
    workspaceId: string|Types.ObjectId;
    userId: string|Types.ObjectId;
    category: string;
    createdAt?: Date|string;
    updatedAt?: Date|string;
    messages?: Message[];
  }) {
    this._id = params._id;
    this.SLno=params.SLno;
    this.title = params.title;
    this.description = params.description;
    this.status = params.status;
    this.priority = params.priority ?? "low"; 
    this.workspaceId = params.workspaceId;
    this.userId = params.userId;
    this.category = params.category;
    this.createdAt = params.createdAt ?? new Date().toISOString();
    this.updatedAt = params.updatedAt ?? new Date().toISOString();
    this.messages = params.messages ?? [];
  }
}


