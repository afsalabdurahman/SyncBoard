export class MessageDTO {
  constructor(
    
    public content: string|undefined,
    public senderName: string|undefined,
    public timestamp?: string|undefined
  ) {

  }
}