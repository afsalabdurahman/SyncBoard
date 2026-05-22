import {PriorityTypes} from "../../types/projectTypes"
export class Rag {
  _id?: string;
  score?: number;
  text?: string;

  metadata?: {
    type: "task" | "project" | "user" | "chat" | "file";  
     taskId?: string;
    projectId?: string;
    userId?: string;
    chatId?: string;
    priority?: PriorityTypes;
    status?: string;
    dueDate?: string;
    projectStatus?: string;
    projectName?: string;
    channel?: string;
    senderName?: string;
    timestamp?: string;
    [key: string]: any
  };

  constructor(init?: Partial<Rag>) {
    Object.assign(this, init);
  }
}
