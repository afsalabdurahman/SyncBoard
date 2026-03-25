import {OTP} from"../../entities/Otp"
export interface IOtpRepository{
  generateOTP(): string;
save(entity:OTP): Promise<void>;
  findOTPbyEMAIL(email: string): Promise<OTP | null>;
deleteOTP(email:string):Promise<boolean>;

}