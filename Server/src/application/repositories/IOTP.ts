export interface IOTP {
    sendOTP?(email:string):Promise<string>
    verifyOTP?(email:string,otp:string):Promise<boolean>
}