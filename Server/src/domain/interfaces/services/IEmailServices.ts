
export interface IEmailService {
    sendOtp(email:string,otp:string) : Promise <void>
    inviteMembers?(email:string,invitaionLink:string):Promise<void>
}