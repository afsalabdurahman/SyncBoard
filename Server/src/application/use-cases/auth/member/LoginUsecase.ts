import { injectable, inject } from "tsyringe";
import { User } from "../../../../domain/entities/User";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { ResponseMessages } from "../../../../common/erroResponse";
import { HttpStatusCode } from "../../../../common/errorCodes";
import { ILogger } from "../../../repositories/ilogger/ILogger";
import {
  CustomError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  AuthenticationError
} from "../../../../utils/errors";

import { ILogin } from "../../../repositories/iauth/ILogin";
import { LoginRequestDTO,LoginResponseDTO } from "../../../dto/AuthDTOs";
import { IWorkspaceRepository } from "../../../../domain/interfaces/repositories/IWorkspaceRepository";
import { AuthMapper } from "../../../mappers/AuthMapper";

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
    if(!input.email||!input.password) throw new NotFoundError("Email or Password not found")
    let user = await this._userRepository.findByEmail(input.email);
  this._logger.info(`Login attempt for email: ${input.email}`);
    if (!user) {
      throw new NotFoundError("User is not found");
    }
    if (!user.workspace) {
      throw new NotFoundError("Workspace is not found");
    }
    if (user.isBlock) throw new ForbiddenError("User is blocked");
    if (user.isDelete) throw new ForbiddenError("User is not found");
    let isTrue = await this._authService.comparePassword(
      input.password,
      user.password
    );
  
    if (!isTrue) {
      throw new CustomError("Password not match",422);
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
}
