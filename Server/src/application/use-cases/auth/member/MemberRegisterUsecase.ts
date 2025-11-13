import { IMemberRegister } from "../../../repositories/IMemberRegister";
import {
  NotFoundError,
  CustomError,
   ValidationError,
  ConflictError,
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
import { ResponseMessages } from "../../../../common/erroResponse";
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
    const isValid= AuthMapper.memberRegisterValidation(dto)
    if (!isValid.success) throw new ValidationError( isValid.error.issues[0].message);
    let isFound = await this._userRepository.findByEmail(dto.email);
    if (isFound)
      throw new ConflictError(ResponseMessages.USER_EXIST);
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
      throw new ValidationError(ResponseMessages.CONFLICT);
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



    let workspace: any = await this.workspaceRepository.findbySlug(
      dto.slug ?? ""
    );
    if (!workspace || !workspace.slug)
      throw new NotFoundError(ResponseMessages.NOT_FOUND + "Workspace");

    const addToWorkspace = await this._userRepository.addToWorkspace(
      createMember._id,
      workspace.id,
      dto.role
    );

    if (!this.workspaceRepository.addMemberToWorkspace)
      throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);

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
