export class Chat {

    senderName:string;
    content:string;
    timestamp:Date;
    constructor(senderName:string,content:string,){

        this.senderName=senderName;
        this.content=content;
        this.timestamp=new Date();
    }
}

