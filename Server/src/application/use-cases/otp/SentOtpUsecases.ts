import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { OTPRepository } from "../../../infrastructure/repositories/OTPRepository";
import { OTP } from "../../../domain/entities/Otp";
import { IOTP } from "../../repositories/IOTP";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { NotFoundError, ValidationError } from "../../../utils/errors";
@injectable()
export class OTPService implements IOTP{
  constructor(
    @inject("OTPRepository") private otpRepository: OTPRepository,
    @inject("IEmailService") private emailService: IEmailService,
      @inject("UserRepository") private _userRepository: IUserRepository,
    
  ) {}

  async sendOTP(email: string): Promise<string> {
     
    if (!this.otpRepository.generateOTP) {
      throw new Error("OTP Repository is not defined");
    }
    const user=await this._userRepository.findByEmail(email)
    if(user) throw new ValidationError("User is already registerd")
    const otp = this.otpRepository.generateOTP();
     await this.emailService.sendOtp(email, otp);
   
      let SaveOtp = new OTP(email, otp);
      await this.otpRepository.save(SaveOtp);
  

    return otp;
  }
}
