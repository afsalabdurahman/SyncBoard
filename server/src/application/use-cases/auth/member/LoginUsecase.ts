import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { ResponseMessages } from "../../../../common/erroResponse";
import { ILogger } from "../../../repositories/ilogger/ILogger";
import { CustomError, ForbiddenError, NotFoundError, ValidationError, AuthenticationError } from "../../../../utils/errors";
import { ILogin } from "../../../repositories/iauth/ILogin";
import { LoginRequestDTO, LoginResponseDTO } from "../../../dto/AuthDTOs";
import { IWorkspaceRepository } from "../../../../domain/interfaces/repositories/IWorkspaceRepository";
import { AuthMapper } from "../../../mappers/AuthMapper";
import { stringToMongoObj } from "../../../../utils/convertMongoObject"
@injectable()
export class LoginUsecase implements ILogin {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("authservice") private _authService: IAuthService,
    @inject("WorkspaceRepository")
    private _workspaceRepository: IWorkspaceRepository,
    @inject('ILogger') private _logger: ILogger
  ) { }

  async loginUser(input: LoginRequestDTO): Promise<LoginResponseDTO> {
console.log(LoginRequestDTO,"login")
    if (!input.email || !input.password) throw new ValidationError(ResponseMessages.EMAIL_NOT_FOUND)
    const isValid = AuthMapper.loginValidation(input)

    if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
    const isExist = await this._userRepository.findByEmail(input.email);
    if (!isExist || !isExist?._id) throw new NotFoundError(ResponseMessages.EMAIL_NOT_FOUND);
    const user = await this._userRepository.findUser(isExist._id)
    if (!user?.isVerified && user?._id) {

      await this._userRepository.deleteuserById(stringToMongoObj(user?._id));
      throw new NotFoundError(ResponseMessages.EMAIL_NOT_FOUND);
    }
    this._logger.info(`Login attempt for email: ${input.email}`);
    if (!user || !user.workspace) {
      throw new NotFoundError(ResponseMessages.INVALID_CREDENTIALS);
    }
    const workspaceId = user?.workspace[0]?.workspaceId;
    const workspaceStatus = await this._workspaceRepository.findByObjectId(workspaceId);
    if (workspaceStatus && workspaceStatus.status === "suspend")
      throw new ForbiddenError(ResponseMessages.WORKSPACE_NOT_FOUND);
    if (user.isBlocked) throw new ForbiddenError(ResponseMessages.USER_BLOCKED);
    if (user.isDeleted) throw new ForbiddenError(ResponseMessages.USER_DELETED);
    const isTrue = await this._authService.comparePassword(
      input.password,
      user.password!
    );
    if (!isTrue) {
      throw new AuthenticationError(ResponseMessages.PASSWORD_FAILED);
    }
    if (!user.workspace?.length) {

      throw new CustomError("Create a new workspace", 403, user);
    }

    const token = await this._authService.generateToken({
      id: user._id!,
      email: user.email!,
      role: user.role!,
    });

    const refreshToken = await this._authService.generateRefreshToken({
      id: user._id!,
      email: user.email!,
      role: user.role!,
    });
    const workspaceData = await this._workspaceRepository.findByObjectId(user.workspace[0].workspaceId)
    if (!workspaceData) throw new NotFoundError(ResponseMessages.NOT_FOUND)
    return AuthMapper.mapEntityToMember(user, workspaceData, token, refreshToken)

  }
  async logoutUser(userId: string): Promise<void> {
    const isResult = await this._userRepository.changeOnlineStatus(stringToMongoObj(userId));
    if (!isResult) throw new ValidationError("Failed to logout")
  }
}
