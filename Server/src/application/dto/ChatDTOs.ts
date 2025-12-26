import { chatAttachmentTypes } from "../../types/chatTypes";


export interface ChatRequestDTO {
    workspaceId:string;
    userId:string;
    content:string;
    sender:string;
    timestamp?:Date
    attachments?:chatAttachmentTypes[]

}
export interface ChatSoketDTO{
    
}