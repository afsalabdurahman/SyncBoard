import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import {
  ValidationError,
  NotFoundError,
} from "../../../../utils/errors";
import { ResponseMessages } from "../../../../common/erroResponse";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { IChangePasword } from "../../../repositories/IChangePassword";
import { AuthMapper } from "../../../mappers/AuthMapper";

@injectable()
export class ChangePasswordUsecase implements IChangePasword {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("AuthService") private _userService: IAuthService,

  ) { }
  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string): Promise<boolean> {

    const user = await this._userRepository.findUser(userId);
    if (!user) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
    const isValid = AuthMapper.PasswordValidator(newPassword);
      if (!isValid.success) throw new ValidationError( isValid.error.issues[0].message);
    const hashedPassword = user.password;
    if (!hashedPassword) throw new ValidationError("Failed to change password");
    const checkPassword = await this._userService.comparePassword(
      currentPassword,
      hashedPassword
    );
    if (checkPassword == false) throw new ValidationError("Current password is incorrect");
    const hashedNewPassword = await this._userService.hashPassword(newPassword)
    const result = await this._userRepository.changePassword(userId, hashedNewPassword)
    if (!result) throw new NotFoundError(ResponseMessages.NOT_FOUND)
    return result
  }
}
