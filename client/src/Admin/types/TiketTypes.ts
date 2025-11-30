export type TicketStatus = "open" | "in_progress" | "resolved" | "reopened";

export interface Message {
  id?: string;
  sender: "admin" | "super_admin";
  content: string;
  timestamp: Date;
}
export interface Ticket {
  _id:string;
  SLno:string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  workspaceId:string;
  userId:string;
}
