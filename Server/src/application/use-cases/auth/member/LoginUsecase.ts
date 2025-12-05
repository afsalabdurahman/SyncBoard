import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { ResponseMessages } from "../../../../common/erroResponse";
import { ILogger } from "../../../repositories/ilogger/ILogger";
import { CustomError,ForbiddenError,NotFoundError,ValidationError,} from "../../../../utils/errors";
import { ILogin } from "../../../repositories/iauth/ILogin";
import { LoginRequestDTO,LoginResponseDTO } from "../../../dto/AuthDTOs";
import { IWorkspaceRepository } from "../../../../domain/interfaces/repositories/IWorkspaceRepository";
import { AuthMapper } from "../../../mappers/AuthMapper";
import {stringToMongoObj} from "../../../../utils/convertMongoObject"
@injectable()
export class LoginUsecase implements ILogin {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("authservice") private _authService: IAuthService,
    @inject("WorkspaceRepository")
        private _workspaceRepository: IWorkspaceRepository,
    @inject('ILogger') private _logger: ILogger
  ) {}

  async loginUser(input:LoginRequestDTO): Promise<LoginResponseDTO> {
    if(!input.email||!input.password) throw new ValidationError(ResponseMessages.INVALID_INPUT)
     const isValid = AuthMapper.loginValidation(input)
     if (!isValid.success) throw new ValidationError( isValid.error.issues[0].message);
    let user = await this._userRepository.findByEmail(input.email);
  this._logger.info(`Login attempt for email: ${input.email}`);
    if (!user) {
      throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
    }
    if (!user.workspace) {
      throw new NotFoundError(ResponseMessages.NOT_FOUND + 'Workspace');
    }
    if (user.isBlock) throw new ForbiddenError(ResponseMessages.USER_STATUS_BLOCK);
    if (user.isDelete) throw new ForbiddenError(ResponseMessages.USER_STATUS_DELETE);
    let isTrue = await this._authService.comparePassword(
      input.password,
      user.password
    );
  
    if (!isTrue) {
      throw new CustomError(ResponseMessages.PASSWORD_FAILED,422);
    }

    let token = await this._authService.generateToken({
      id: user._id!,
      email: user.email!,
      role: user.role!,
    });

    let refreshToken = await this._authService.generateRefreshToken({
      id: user._id!,
      email: user.email!,
      role: user.role!,
    });
   const workspaceData=await this._workspaceRepository.findByObjectId(user.workspace[0].workspaceId)
return AuthMapper.mapEntityToMember(user,workspaceData,token,refreshToken)
   
  }
  async logoutUser(userId: string): Promise<void> {
   const  isResult=await this._userRepository.changeOnlineStatus(stringToMongoObj(userId));
   if(!isResult) throw new ValidationError("Failed to logout")
  }
}
