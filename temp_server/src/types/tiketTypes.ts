export type TicketStatus = "open" | "in_progress" | "resolved" | "reopened";

export interface Message {
  id?: string;
  sender: "admin" | "super_admin";
  content: string;
  timestamp: Date;
}