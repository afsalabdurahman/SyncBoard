import { IMemberRegister } from "../../../repositories/IMemberRegister";
import {NotFoundError,CustomError,ValidationError,ConflictError,} from "../../../../utils/errors";
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
import { IinvitationRepository } from "../../../../domain/interfaces/repositories/IInvitationRepository";
import { io } from "../../../../server";
@injectable()
export class MemberRegisterUsecase implements IMemberRegister {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("AuthService") private _authService: IAuthService,
    @inject("WorkspaceRepository")
    private _workspaceRepository: IWorkspaceRepository,
          @inject("InvitaionRepository") private _invitaionRepository: IinvitationRepository,
    
  ) {}
  async execute(
    dto: MemeberRegisterRequestDTO
  ): Promise<MemberRegisterResposeDTO> {
   const isValidLink=await this._invitaionRepository.findInvitaionLinkByEmail(dto.email);
  console.log(isValidLink,"LINKSS");
  console.log(dto,"DTOOO")
   if(!isValidLink) throw new NotFoundError("Invalid link")
  const status=AuthMapper.InvitationLinkValidation(isValidLink?.status,isValidLink?.invitedTo,dto.email,isValidLink?.token.toString(),dto.token)
 console.log(status,"status")
   if(!status) throw new NotFoundError("Invalid link")
   const isValid= AuthMapper.memberRegisterValidation(dto)
    if (!isValid.success) throw new ValidationError( isValid.error.issues[0].message);
  const tokens =dto.token
    const isFound = await this._userRepository.findByEmail(dto.email);
  
    if (isFound){ 
     io.emit(tokens, {
          name: ResponseMessages.NEW_PROJECT_ADDED,
          message: 'error'
        });
throw new ConflictError(ResponseMessages.USER_EXISTS)


    }
    const hashedPassword = await this._authService.hashPassword(dto.password);
    dto.password = hashedPassword;
    if (!hashedPassword)
      throw new CustomError(
        ResponseMessages.PASSWORD_FAILED,
        HttpStatusCode.CONFLICT
      );
    
    const newMember = AuthMapper.mapMemebrToEntity(dto);
    const createMember = await this._userRepository.create(newMember);
    if (!createMember || !createMember._id)
      throw new ValidationError(ResponseMessages.CONFLICT);
    const token = this._authService.generateToken({
      id: createMember._id!,
      email: createMember.email!,
      role: createMember.role!,
    });
    const refreshToken = this._authService.generateRefreshToken({
      id: createMember._id!,
      email: createMember.email!,
      role: createMember.role!,
    });



    const workspace = await this._workspaceRepository.findbySlug(
      dto.slug!
    );
    if (!workspace || !workspace.slug ||!workspace._id )
      throw new NotFoundError(ResponseMessages.NO_CONTENT + "Workspace");
    await this._userRepository.addToWorkspace(
      createMember._id,
      workspace._id,
      dto.role,
      "Member",
    );

    if (!this._workspaceRepository.addMemberToWorkspace)
      throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);

    const insertToWorkspce =
      await this._workspaceRepository.addMemberToWorkspace(
        workspace.slug,
        createMember._id,
         "Member",
        "Member",
         "Member"  
      );

    //   slug: string,
    // userId: string,
    // title: string,
    // permission: string,
    // role:string,
if(!insertToWorkspce) throw new NotFoundError(ResponseMessages.WORKSPACE_NOT_FOUND);

    const response = AuthMapper.mapEntityToMember(
      createMember,
      insertToWorkspce,
      token,
      refreshToken
    );

    return response;
  }
}
