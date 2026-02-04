import { chatAttachmentTypes } from "../../types/chatTypes";
import { Types } from "mongoose";

export interface ChatRequestDTO {
    workspaceId:string;
    userId:string;
    content:string;
    sender:string;
    timestamp?:Date
    attachments?:chatAttachmentTypes[]

}
export interface ChatAttachment {
  name?: string;
  url?: string;
  type?: string;
}


export interface ChatMessage {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  senderName: string;
  content: string;
  attachments: {
    name?: string;
    url?: string;
    type?: string;
  }[];
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

