export interface Attachment {
  name: string;
  url: string; 
  blob: Blob;
  type: "image" | "video" | "pdf" | "doc" | "audio" | "other";
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  attachments?: Attachment[];
  reactions?: Reaction[];
  workspaceId:string;
  userId:string;
}
export interface KanbanAttachment {
  id: string;
  file: File;
  type: "image" | "pdf" | "doc" | "other";
  preview?: string;
}
export interface KanbanComment {
  id: number;
  name: string;
  text: string;
  timestamp: Date;
  attachments: KanbanAttachment[];
}
export interface KanbanTask {
  id: string;
  projectName: string;
  taskName: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "progress" | "completed";
  approvalStatus: string;
  rejectionMsg: string | null;
  comments: KanbanComment[];
  attachments:string[];
  subTask?: { title: string; status: "Pending" | "Completed" }[];
}
export interface KanbanApiTask {
  _id: string;
  project?: string;
  name?: string;
  description?: string;
  dueDate?: string;
  approvalStatus?: string;
  rejectionMsg?: string;
  priority?: string;
  status?: string;
  attachedURLs?: string[];
  subTask?: { title: string; status: "Pending" | "Completed" }[];
}
export interface Notification {
  id?: string;
  title?: string;
  message: string;
  time?: string;
  type?: "message" | "like" | "follow" | "system";
  read?: boolean;
}
export interface Subtask {
  
  title: string;
  status: "Pending"| "Completed";
  estimate:number
}