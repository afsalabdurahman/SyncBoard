import {OTP} from"../../entities/Otp"
export interface IOtpRepository{
  generateOTP?(): string;
save?(entity:OTP): Promise<void>;
  findByEmail(email: string): Promise<OTP | null>;
  deleteByEmail?(email: string): Promise<void>;
}