import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import {
  ValidationError,
  NotFoundError,
  CustomError,
} from "../../../../utils/errors";
import { HttpStatusCode } from "../../../../common/errorCodes";
import { ResponseMessages } from "../../../../common/erroResponse";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { IEmailService } from "../../../../domain/interfaces/services/IEmailServices";
import { OTPService } from "../../../use-cases/otp/SentOtpUsecases";
import { IChangePasword } from "../../../repositories/IChangePassword";
// import {VerifyOtp} from"../../otp/VerifyOtpUsecases"

@injectable()
export class ChangePasswordUsecase implements IChangePasword {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("AuthService") private userService: IAuthService,
   
  ) {}
  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    let user = await this.userRepository.findById(userId);
    console.log(user, "@usecase");
    if (!user) throw new NotFoundError("User not Found");
    let hashedPassword = user.password;
    let checkPassword = await this.userService.comparePassword(
      currentPassword,
      hashedPassword
    );
    console.log(checkPassword, "@passUsecse");
    if (!checkPassword) throw new ValidationError("Password not match");
    let hashedNewPassword = await this.userService.hashPassword(newPassword)
   let result=await this.userRepository.changePassword(userId,hashedNewPassword)
   if(!result) throw new ValidationError("Validation filed")
    return result
}
}
