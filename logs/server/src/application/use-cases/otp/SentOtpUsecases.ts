import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { OTP } from "../../../domain/entities/Otp";
import { IOTP } from "../../repositories/IOTP";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { NotFoundError, ValidationError, ConflictError } from "../../../utils/errors";
import { MailRequestDTO } from "../../dto/MailDTO";
import { AuthMapper } from "../../mappers/AuthMapper";
import { AdminSignupRequestDTO, AdminSignupResponseDTO } from "../../dto/AuthDTOs";
import { ResponseMessages } from "../../../common/erroResponse";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository"
import { User } from "../../../domain/entities/User";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
import { IAuthService } from "../../../domain/interfaces/services/IAuthService";
@injectable()
export class OTPService implements IOTP {
  constructor(
    @inject("OTPRepository") private _otpRepository: IOtpRepository,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("UserRepository") private _userRepository: IUserRepository,
     @inject("AuthService") private _authService: IAuthService,

  ) { }

  async sendOTP(input: MailRequestDTO): Promise<string> {

    const isValid = AuthMapper.registerValidation(input as AdminSignupRequestDTO)
    if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
    const user = await this._userRepository.findByEmail(input.email)
    if (user) throw new ConflictError(ResponseMessages.USER_EXIST);
    const findOTP = await this._otpRepository.findOTPbyEMAIL(input.email);
    if (findOTP) {
      await this._otpRepository.deleteOTP(input.email)
    }
    const otp = this._otpRepository.generateOTP();
    await this._emailService.sendOtp(input.email, otp);

    const SaveOtp = new OTP(input.email, otp);
    await this._otpRepository.save(SaveOtp);


    return otp;
  }
  async verifyOTP(input: MailRequestDTO): Promise<AdminSignupResponseDTO> {
    const isOtp = await this._otpRepository.findOTPbyEMAIL(input.email);
    const user = await this._userRepository.findByEmail(input.email);
    if (!user?._id ) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);


    if (isOtp && isOtp.otp === input.otp) {
    
     const savedUser= await this._userRepository.userVerified(stringToMongoObj( user._id),true,null)
     if(!savedUser) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
     const token = this._authService.generateToken({
       id: savedUser._id!,
       email: savedUser.email!,
       role: savedUser.role!,
     });
      const refreshToken = this._authService.generateRefreshToken({
       id: savedUser._id!,
       email: savedUser.email!,
       role: savedUser.role!,
     });
     await this._userRepository.updateOnlineStatus(savedUser._id??"")
       return AuthMapper.mapEntityToUser(savedUser, token, refreshToken)
    } else {
      throw new ValidationError(ResponseMessages.OTP_INVALID);
    }

  }
  async reSendOTP(email: string): Promise<void> {
    const isValid = AuthMapper.emailValidator(email)
    if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);

    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
    const findOTP = await this._otpRepository.findOTPbyEMAIL(email);
    if (findOTP) {
      await this._otpRepository.deleteOTP(email)
    }
    const otp = this._otpRepository.generateOTP();
    // await this._emailService.sendOtp(email, otp);
    const SaveOtp = new OTP(email, otp);
    await this._otpRepository.save(SaveOtp);

  }
}
