export interface ISentInvitaion {
 send(emails:string[],invitaionLink:string,workspaceId:string):Promise<boolean>
 accpetinvitaion(slug:string,userId:string):Promise<void>;
 rejectInvitation(slug:string,email:string):Promise<void>
}