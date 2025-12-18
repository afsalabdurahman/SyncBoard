
export interface IEmailService {
    sendOtp(email:string,otp:string) : Promise <void>
    inviteMembers(email:string,invitationLink:string):Promise<void>;
    sendAbuseStatus(email:string,message:string|boolean,status:string,name:string):Promise<void>
}