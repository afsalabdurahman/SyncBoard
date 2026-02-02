export interface ISentInvitaion {
 send(emails:string[],invitaionLink:string):Promise<boolean>
}