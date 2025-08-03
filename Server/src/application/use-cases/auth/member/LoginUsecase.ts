import { injectable, inject } from "tsyringe";
import { User } from "../../../../domain/entities/User";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { ResponseMessages } from "../../../../common/erroResponse";
import { HttpStatusCode } from "../../../../common/errorCodes";
import {
  CustomError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../../../../utils/errors";
import { ILogin } from "../../../repositories/iauth/ILogin";

@injectable()
export class LoginUsecase implements ILogin {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("authservice") private authService: IAuthService
  ) {}

  async loginUser(email: string, password: string): Promise<any> {
    console.log(email, password, "usecases");
    let user: User = await this.userRepository.findByEmail(email);
    console.log(user, "userDatafrom usecses");
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (user.isBlock) throw new ForbiddenError("User is blocked");
    if (user.isDelete) throw new ForbiddenError("User is not found");
    let isTrue = await this.authService.comparePassword(
      password,
      user.password
    );
    console.log(isTrue, "####");
    if (!isTrue) {
      throw new ValidationError("Password not match");
    }

    let token = await this.authService.generateToken({
      id: user._id!,
      email: user.email!,
      role: user.role!,
    });

    let refreshToken = await this.authService.generateRefreshToken({
      id: user._id!,
      email: user.email!,
      role: user.role!,
    });
    return { user, token, refreshToken };
  }
}
