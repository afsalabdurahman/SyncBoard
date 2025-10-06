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
import { LoginRequestDTO,LoginResponseDTO } from "../../../dto/AuthDTOs";
import { IWorkspaceRepository } from "../../../../domain/interfaces/repositories/IWorkspaceRepository";
import { AuthMapper } from "../../../mappers/AuthMapper";

@injectable()
export class LoginUsecase implements ILogin {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("authservice") private _authService: IAuthService,
     @inject("WorkspaceRepository")
        private _workspaceRepository: IWorkspaceRepository
  ) {}

  async loginUser(input:LoginRequestDTO): Promise<LoginResponseDTO> {
    if(!input.email||!input.password) throw new NotFoundError("Email or Password not found")
    let user = await this._userRepository.findByEmail(input.email);
    console.log(user, "userDatafrom usecses");
    if (!user || !user.workspace) {
      throw new NotFoundError("User or Workspace not found");
    }
    if (user.isBlock) throw new ForbiddenError("User is blocked");
    if (user.isDelete) throw new ForbiddenError("User is not found");
    let isTrue = await this._authService.comparePassword(
      input.password,
      user.password
    );
    console.log(isTrue, "####");
    if (!isTrue) {
      throw new ValidationError("Password not match");
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
