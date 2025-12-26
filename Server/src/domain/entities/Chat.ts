import { chatAttachmentTypes } from "../../types/chatTypes";
export class Chat {

    senderName:string;
    content:string;
    timestamp?:Date;
    workspaceId?:string;
    userId?:string;
     attachments?:chatAttachmentTypes[];
     
    constructor(senderName:string,content:string,workspceId:string,userId:string,attachments?:chatAttachmentTypes[],){

        this.senderName=senderName;
        this.content=content;
        this.timestamp=new Date();
        this.workspaceId=workspceId;
        this.userId=userId;
        this.attachments=attachments;
        
    }
}

