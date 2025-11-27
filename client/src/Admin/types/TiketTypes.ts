export type TicketStatus = "open" | "in_progress" | "resolved" | "reopened";

export interface Message {
  id: string;
  sender: "admin" | "super_admin";
  content: string;
  timestamp: Date;
}
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high" | "critical";
  workspace: string;
  company: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}