import { OTP } from "../../../domain/entities/Otp";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { OTPRepository } from "../../../infrastructure/repositories/OTPRepository";
import { inject, injectable } from "tsyringe";
import {IOtpRepository} from "../../../domain/interfaces/repositories/IOtpRepository"
import {
  ValidationError,
  NotFoundError,
  InternalServerError,
} from "../../../utils/errors";
@injectable()
export class VerifyOtp {
  constructor(@inject("OTPRepository") private otpRespository: IOtpRepository) {}

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    console.log(email, otp, "emial and otp");
    if (!this.otpRespository) {
      throw new InternalServerError("OTP repository is not initialized");
    }
    const isOtp = await this.otpRespository.findByEmail(email);
    try {
      if (isOtp && isOtp.otp === otp) {
        return true;
      } else {
        throw new NotFoundError(" Otp is not found");
      }
    } catch (error) {
      console.log(error);
      return false;
      throw new InternalServerError("Some thing went to wrong");
    }
  }
}
