export interface ISentInvitaion {
 send(emails:string[],invitaionLink:string,workspaceId:string):Promise<boolean>
}