import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { OTPRepository } from "../../../infrastructure/repositories/OTPRepository";
import { OTP } from "../../../domain/entities/Otp";
import { IOTP } from "../../repositories/IOTP";

@injectable()
export class OTPService implements IOTP{
  constructor(
    @inject("OTPRepository") private otpRepository: OTPRepository,
    @inject("IEmailService") private emailService: IEmailService
  ) {}

  async sendOTP(email: string): Promise<string> {
    if (!this.otpRepository.generateOTP) {
      throw new Error("OTP Repository is not defined");
    }
    const otp = this.otpRepository.generateOTP();
    await this.emailService.sendOtp(email, otp);
    try {
      let SaveOtp = new OTP(email, otp);
      await this.otpRepository.save(SaveOtp);
    } catch (error) {
      console.log(error, "errr");
    }

    return otp;
  }
}
