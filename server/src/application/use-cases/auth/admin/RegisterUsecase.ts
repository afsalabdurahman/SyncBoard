import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { injectable, inject } from "tsyringe";
import { NotFoundError, ValidationError,ConflictError } from "../../../../utils/errors";
import { IAuth } from "../../../repositories/iauth/IAuth";
import { AdminSignupRequestDTO, AdminSignupResponseDTO } from "../../../dto/AuthDTOs";
import { AuthMapper } from "../../../mappers/AuthMapper";
import { ResponseMessages } from "../../../../common/erroResponse";
import { IEmailService } from "../../../../domain/interfaces/services/IEmailServices";
import { IOtpRepository } from "../../../../domain/interfaces/repositories/IOtpRepository";
import { OTP } from "../../../../domain/entities/Otp";
import { User } from "../../../../domain/entities/User";


@injectable()
export class RegisterUseCase implements IAuth {
  constructor(
    @inject("AuthService") private _authService: IAuthService,
    @inject("UserRepository") private _userRepository: IUserRepository,
       @inject("OTPRepository") private _otpRepository: IOtpRepository,
           @inject("IEmailService") private _emailService: IEmailService,
  ) {}

  async execute(
    input: AdminSignupRequestDTO
  ): Promise<User> {
    const isValid = AuthMapper.registerValidation(input);
    if (!isValid.success) throw new ValidationError( isValid.error.issues[0].message);
    const existingUser = await this._userRepository.findByEmail(input.email);
    if (existingUser) throw new ConflictError  (ResponseMessages.USER_EXIST);
  
    const hashedPassword = await this._authService.hashPassword(input.password as string);
    input.password = hashedPassword;
    const AdminEntity = AuthMapper.mapUserToEntity(input)


    const savedUser = await this._userRepository.create(AdminEntity);
       const findOTP = await this._otpRepository.findOTPbyEMAIL(input.email);
      if (findOTP) {
      await this._otpRepository.deleteOTP(input.email)
    }
  const otp = this._otpRepository.generateOTP();
   // await this._emailService.sendOtp(input.email, otp);

    const SaveOtp = new OTP(input.email, otp);
    await this._otpRepository.save(SaveOtp);
    if (!savedUser) throw new NotFoundError(ResponseMessages.NOT_FOUND);
    // const token = this._authService.generateToken({
    //   id: savedUser._id!,
    //   email: savedUser.email!,
    //   role: savedUser.role!,
    // });
    // const refreshToken = this._authService.generateRefreshToken({
    //   id: savedUser._id!,
    //   email: savedUser.email!,
    //   role: savedUser.role!,
    // });
   // await this._userRepository.updateOnlineStatus(savedUser._id??"")
    return savedUser

  }
}
