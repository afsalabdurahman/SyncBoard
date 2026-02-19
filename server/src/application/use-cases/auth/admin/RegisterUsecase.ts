import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { injectable, inject } from "tsyringe";
import { NotFoundError, ValidationError,ConflictError } from "../../../../utils/errors";
import { IAuth } from "../../../repositories/iauth/IAuth";
import { AdminSignupRequestDTO, AdminSignupResponseDTO } from "../../../dto/AuthDTOs";
import { AuthMapper } from "../../../mappers/AuthMapper";
import { ResponseMessages } from "../../../../common/erroResponse";


@injectable()
export class RegisterUseCase implements IAuth {
  constructor(
    @inject("AuthService") private _authService: IAuthService,
    @inject("UserRepository") private _userRepository: IUserRepository
  ) {}

  async execute(
    input: AdminSignupRequestDTO
  ): Promise<AdminSignupResponseDTO> {
    const isValid = AuthMapper.registerValidation(input);
    if (!isValid.success) throw new ValidationError( isValid.error.issues[0].message);
    const existingUser = await this._userRepository.findByEmail(input.email);
    if (existingUser) throw new ConflictError  (ResponseMessages.USER_EXIST);
  
    const hashedPassword = await this._authService.hashPassword(input.password as string);
    input.password = hashedPassword;
    const AdminEntity = AuthMapper.mapUserToEntity(input)


    const savedUser = await this._userRepository.create(AdminEntity);
   console.log(savedUser,"userSaved.....");
    if (!savedUser) throw new NotFoundError(ResponseMessages.NOT_FOUND);
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

  }
}
