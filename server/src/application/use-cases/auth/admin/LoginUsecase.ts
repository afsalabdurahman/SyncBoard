import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { injectable, inject } from "tsyringe";
import { ForbiddenError, NotFoundError, ValidationError } from "../../../../utils/errors";
import { ILoginUseCase } from "../../../repositories/admin/ILoginUseCase";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { IWorkspaceRepository } from "../../../../domain/interfaces/repositories/IWorkspaceRepository"
import { ISuscription } from "../../../../domain/interfaces/repositories/ISuscriptionRepository";
import { Subscription } from "../../../../domain/entities/Suscription";
import { adminResponseDTO, LoginRequestDTO, SuperadminLoginResponseDTO, } from "../../../dto/AuthDTOs";
import { ResponseMessages } from "../../../../common/erroResponse";

@injectable()
export class AdminLoginUseCase implements ILoginUseCase {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("AuthService") private _authService: IAuthService,
    @inject("WorkspaceRepository") private _workspceRepository: IWorkspaceRepository,
    @inject("SuscriptionRepository") private _suscriptionRepository: ISuscription,
  ) { }

  async execute(input: LoginRequestDTO): Promise<adminResponseDTO> {
    const user = await this._userRepository.findByEmail(input.email)
    if (!user || !user.workspace) throw new NotFoundError(ResponseMessages.NOT_FOUND)
    const workspceId = user.workspace[0].workspaceId
    if (!user) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
    const isValid = await this._authService.comparePassword(
      input.password,
      user.password!
    );
    if (!isValid) throw new ValidationError(ResponseMessages.PASSWORD_FAILED);

    const workspace = await this._workspceRepository.findByObjectId(workspceId)
    if (!workspace || !workspace.status) throw new NotFoundError(ResponseMessages.NOT_FOUND)
    if (workspace?.status.toLowerCase() == "suspend") throw new ForbiddenError("Workspace not found")
    if (!user._id || !workspace?._id) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND)
    const isSuscribed = await this._suscriptionRepository.findSuscriptionByUserId(user._id);

    let mySuscription;
    if (!isSuscribed) {
      const entity = new Subscription({
        user: user._id,
        workspace: workspace._id?.toString(),
        planKey: "free",
        status: "trialing"
      });
      mySuscription = await this._suscriptionRepository.create(entity)
    }
    const suscribe = isSuscribed ? isSuscribed : mySuscription;

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


    return { user, workspace, suscribe, token, refreshToken } as adminResponseDTO;
  }

  async superAdmin(input: LoginRequestDTO): Promise<SuperadminLoginResponseDTO | null> {
    const superAdmin = await this._userRepository.findByEmail(input.email)
    if (!superAdmin || !superAdmin.isSuperAdmin) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
    const token = this._authService.generateToken({
      id: superAdmin._id ?? "",
      email: superAdmin.email!,
      role: superAdmin.role!,
    })
    if (!token) throw new ValidationError(ResponseMessages.INVALID_TOKEN)
    const refreshToken = this._authService.generateRefreshToken({
      id: superAdmin._id!,
      email: superAdmin.email!,
      role: superAdmin.role!,
    });
    if (!refreshToken) throw new ValidationError(ResponseMessages.NOT_FOUND + 'Refresh Token')

    return { token, refreshToken, superAdmin }
  }

}
