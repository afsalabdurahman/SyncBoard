import { injectable, inject } from "tsyringe";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { Workspace } from "../../../domain/entities/Workspace";
import { HttpStatusCode } from "../../../common/errorCodes";
import { IActivity } from "../../repositories/IActivity";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { Types } from "mongoose";
import { IWorkspace } from "../../repositories/iworkspace/IWorkspace";
import {
  WorkspaceRequestDTO,
  WorkspaceResponseDTO,
} from "../../dto/WorkspaceDTOs";
import { WorkspaceRepository } from "../../../infrastructure/repositories/WorkspaceRepository";
import { slugify } from "../../../utils/slug";
import { WorkspaceMapper } from "../../mappers/WorkspaceMapper";
import { IActivityRepository } from "../../../domain/interfaces/repositories/IActivityRepository";
@injectable()
export class CreateWorkspaceUsecases implements IWorkspace {
  constructor(
    @inject("WorkspaceRepository")
    private _workspaceRepository: IWorkspaceRepository,
    @inject("IUserRepository") private _userRepository: IUserRepository,
    // @inject("ActivityUsecase") private _activityUsecase: IActivity
  ) {}

  async createWorkspace(
    input: WorkspaceRequestDTO
  ): Promise<WorkspaceResponseDTO> {
 console.log(input)
  const isValid =  WorkspaceMapper.validateWorkspace(input);
     if (!isValid.success) throw new ValidationError("Validation failed");
    const user = await this._userRepository.findByEmail(input.email);

    if (!user) throw new NotFoundError("User not found");
    const slugfyied = slugify(input.slug);
    input.slug = slugfyied;

    const workspaceEntity = WorkspaceMapper.mapWorkspaceToEntity(
      input,
      user._id,
      input.title
    );
  
    const isCreateWorkspace =await this._workspaceRepository.create(workspaceEntity);
    if (!isCreateWorkspace || !isCreateWorkspace._id)
      throw new ValidationError("Not matched with schema");

    const updatedUser = await this._userRepository.addToWorkspace(
      user._id,
      isCreateWorkspace._id,
      input.title
    );
    if (!updatedUser) throw new NotFoundError("User is not found");
  //  const msg =await  this._activityUsecase.execute(
  //     isCreateWorkspace._id.toString(),
  //     isCreateWorkspace.name,
  //     user.name
  //   );
    // console.log(msg,"from activity")

    return WorkspaceMapper.mapEntityToWorkspace(updatedUser, isCreateWorkspace);
  }

  async findWorkspace(id: Types.ObjectId): Promise<any> {
    let data = await this._workspaceRepository.findByObjectId(id);
   
    return data;
  }
  async updateWorkspace(
    id: Types.ObjectId,
    logId: Types.ObjectId
  ): Promise<boolean> {
    if (!this._workspaceRepository.addlogId) throw new NotFoundError("not");
    const result = this._workspaceRepository.addlogId(id, logId);
    if (!result) throw new InternalServerError("Something went to wrong");
    return true;
  }
}
