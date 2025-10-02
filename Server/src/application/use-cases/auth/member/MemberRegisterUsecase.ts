import { User } from "../../../../domain/entities/User";
import { IMemberRegister } from "../../../repositories/IMemberRegister";
import {
  NotFoundError,
  CustomError,
  InternalServerError,
} from "../../../../utils/errors";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { injectable, inject } from "tsyringe";
import { HttpStatusCode } from "../../../../common/errorCodes";
import { IWorkspaceRepository } from "../../../../domain/interfaces/repositories/IWorkspaceRepository";
import {
  MemberRegisterResposeDTO,
  MemeberRegisterRequestDTO,
} from "../../../dto/AuthDTOs";
import { AuthMapper } from "../../../mappers/AuthMapper";
@injectable()
export class MemberRegisterUsecase implements IMemberRegister {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("AuthService") private _authService: IAuthService,
    @inject("WorkspaceRepository")
    private workspaceRepository: IWorkspaceRepository
  ) {}

  async execute(
    dto: MemeberRegisterRequestDTO
  ): Promise<MemberRegisterResposeDTO> {
    let isFound = await this._userRepository.findByEmail(dto.email);
    if (isFound)
      throw new CustomError("User is exists", HttpStatusCode.CONFLICT);
    let hashedPassword = await this._authService.hashPassword(dto.password);
    dto.password = hashedPassword;
    if (!hashedPassword)
      throw new CustomError(
        "Something went to wrong ",
        HttpStatusCode.CONFLICT
      );
    const newMember = AuthMapper.mapMemebrToEntity(dto);

    let createMember = await this._userRepository.create(newMember);
    if (!createMember || !createMember._id)
      throw new InternalServerError("Member creation Failed");
    const token = this._authService.generateToken({
      id: createMember._id ?? "",
      email: createMember.email!,
      role: createMember.role!,
    });
    const refreshToken = this._authService.generateRefreshToken({
      id: createMember._id!,
      email: createMember.email!,
      role: createMember.role!,
    });

    if (!this.workspaceRepository.findbySlug) {
      throw new NotFoundError("not found rep0o");
    }

    let workspace: any = await this.workspaceRepository.findbySlug(
      dto.slug ?? ""
    );
    if (!workspace || !workspace.slug)
      throw new NotFoundError("Workspace not found ");

    const addToWorkspace = await this._userRepository.addToWorkspace(
      createMember._id,
      workspace.id,
      dto.role
    );

    if (!this.workspaceRepository.addMemberToWorkspace)
      throw new NotFoundError("member not found ");

    const insertToWorkspce =
      await this.workspaceRepository.addMemberToWorkspace(
        workspace.slug,
        createMember._id,
        dto.role,
        dto.name,
        dto.email,
        dto.title
      );

    const response = AuthMapper.mapEntityToMember(
      createMember,
      insertToWorkspce,
      token,
      refreshToken
    );

    return response;
  }
}
