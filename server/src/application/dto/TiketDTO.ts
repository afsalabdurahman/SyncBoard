export type TicketStatus = "open" | "in_progress" | "resolved" | "reopened";

export interface Message {
    id: string;
    sender: "admin" | "super_admin";
    content: string;
    timestamp: string;
}
export interface ticketRequestDTO {
    id:string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: "low" | "medium" | "high" | "critical";
    workspaceId: string;
    userId: string;
    category:string;
    createdAt: string;
    updatedAt: string;
    messages: Message[];
}
interface TiketDTO {
    
}