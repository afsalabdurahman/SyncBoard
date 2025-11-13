import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { OTP } from "../../../domain/entities/Otp";
import { IOTP } from "../../repositories/IOTP";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { NotFoundError, ValidationError } from "../../../utils/errors";
import { MailRequestDTO } from "../../dto/MailDTO";
import { AuthMapper } from "../../mappers/AuthMapper";
import { AdminSignupRequestDTO } from "../../dto/AuthDTOs";
import { ResponseMessages } from "../../../common/erroResponse";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository"
@injectable()
export class OTPService implements IOTP {
  constructor(
    @inject("OTPRepository") private _otpRepository: IOtpRepository,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("UserRepository") private _userRepository: IUserRepository,

  ) { }

  async sendOTP(input: MailRequestDTO): Promise<string> {

    
    const isValid = AuthMapper.registerValidation(input as AdminSignupRequestDTO)
    if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
    const user = await this._userRepository.findByEmail(input.email)
    if (user) throw new ValidationError(ResponseMessages.USER_EXIST)
    const otp = this._otpRepository.generateOTP();
    await this._emailService.sendOtp(input.email, otp);

    const SaveOtp = new OTP(input.email, otp);
    await this._otpRepository.save(SaveOtp);


    return otp;
  }
  async verifyOTP(input: MailRequestDTO): Promise<boolean> {
 const isOtp = await this._otpRepository.findOTPbyEMAIL(input.email);

    if (isOtp && isOtp.otp === input.otp) {
      return true;
    } else {
      throw new NotFoundError(ResponseMessages.NOT_FOUND + 'OTP');
    }

  }
}
