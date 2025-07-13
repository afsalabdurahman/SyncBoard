import { injectable, inject } from "tsyringe";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IAuthService } from "../../../domain/interfaces/services/IAuthService";
import { ResponseMessages } from "../../../common/erroResponse";
import { HttpStatusCode } from "../../../common/errorCodes";
import { NotFoundError, ValidationError } from "../../../utils/errors";

@injectable()
export class LoginUsecase {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("authservice") private authService: IAuthService
  ) {}

  async loginUser(email: string, password: string): Promise<any> {
    console.log(email,password,"usecases")
    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    console.log(user.password)
    let isTrue = await this.authService.comparePassword(
      password,
      user.password
    );
    console.log(isTrue,"####")
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
    return {user,token,refreshToken}
  }
}
