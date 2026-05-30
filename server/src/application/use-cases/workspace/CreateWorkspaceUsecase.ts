import { injectable, inject } from "tsyringe";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import ExcelJS from "exceljs"
import { excelWorkspaceModel } from "../../../utils/excelModel"
import {
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { Types } from "mongoose";
import { IWorkspace } from "../../repositories/iworkspace/IWorkspace";
import {
  listWorkspace,
  WorkspaceRequestDTO,
  WorkspaceResponseDTO,
} from "../../dto/WorkspaceDTOs";
import { slugify } from "../../../utils/slug";
import { WorkspaceMapper } from "../../mappers/WorkspaceMapper";
import { Workspace } from "../../../domain/entities/Workspace";
import { ISuscription } from "../../../domain/interfaces/repositories/ISuscriptionRepository";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
import { UserInWorkspaceDTO } from "../../dto/UserDTO";



@injectable()
export class CreateWorkspaceUsecases implements IWorkspace {
  constructor(
    @inject("WorkspaceRepository")
    private _workspaceRepository: IWorkspaceRepository,
    @inject("IUserRepository") private _userRepository: IUserRepository,
    @inject("SuscriptionRepository")
    private _suscriptionRepository: ISuscription,
  ) { }

  async createWorkspace(
    input: WorkspaceRequestDTO
  ): Promise<WorkspaceResponseDTO> {

    const isValid = WorkspaceMapper.validateWorkspace(input);

    if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);

    const user = await this._userRepository.findByEmail(input.email);

    if (!user) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
    const slugfyied = slugify(input.slug);
    input.slug = slugfyied;

    const workspaceEntity = WorkspaceMapper.mapWorkspaceToEntity(
      input,
      user._id ?? "",
      input.title,
    );

    const isCreateWorkspace = await this._workspaceRepository.create(workspaceEntity);
    if (!isCreateWorkspace || !isCreateWorkspace._id)
      throw new ValidationError(ResponseMessages.NO_CONTENT + ' Workspace');

    const updatedUser = await this._userRepository.addToWorkspace(
      user._id ?? "",
      isCreateWorkspace._id,
      input.title
    );
    if (!updatedUser) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);

    return WorkspaceMapper.mapEntityToWorkspace(updatedUser, isCreateWorkspace);
  }

  async findWorkspace(id: Types.ObjectId): Promise<Workspace | null> {
    const workspace = await this._workspaceRepository.findByObjectId(id);

    return workspace;
  }
  async updateWorkspace(
    id: Types.ObjectId,
    logId: Types.ObjectId
  ): Promise<boolean> {
    if (!this._workspaceRepository.addlogId) throw new NotFoundError(ResponseMessages.NO_CONTENT);
    const result = this._workspaceRepository.addlogId(id, logId);
    if (!result) throw new InternalServerError(ResponseMessages.CONFLICT);
    return true;
  }

  async updateWorkspaceData(id: string, merge: Record<string, string>): Promise<void> {
    const isValid = WorkspaceMapper.workspaceUpdateValidator(merge);
    if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
    if (merge.planKey) {
      this._suscriptionRepository.updateSubscriptionByWorkspaceId(stringToMongoObj(id), merge.planKey, "active")
    }
    await this._workspaceRepository.updateWorkspaceDate(id, merge)



  }
  async generateWorkspaceExcel(): Promise<Buffer> {
    const workspaceData = await this._workspaceRepository.findAll();

    if (workspaceData.length === 0) {
      throw new NotFoundError(ResponseMessages.NO_CONTENT);
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SuperAdmin';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet('Workspaces');
    worksheet.columns = excelWorkspaceModel;

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    workspaceData.forEach((space) => {
      const memberRoles = space.members
        ?.map((m) => m.title || 'Unknown')
        .filter(Boolean)
        .join(', ') || 'No members';

      const memberUserIds = space.members
        ?.map((m) => m.userId)
        .filter(Boolean)
        .join(', ') || 'None';

      worksheet.addRow({
        _id: space._id?.toString() ?? 'N/A',
        name: space.name ?? '',
        role: space.role ?? '',
        slug: space.slug ?? '',
        ownerId: space.ownerId ?? 'N/A',
        createdAt: space.createdAt
          ? new Date(space.createdAt).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
          : 'N/A',
        status: space.status ?? 'Unknown',
        storage: space.storage ?? 0,
        memberCount: space.members?.length ?? 0,
        memberRoles,
        memberUserIds,
      });
    });

    worksheet.autoFilter = 'A1:K1';
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as Buffer;
  }
  async listWorkspacesByUserId(userId: string): Promise<listWorkspace[]> {
    const list = await this._workspaceRepository.findWorkspacesByUserId(userId);
    if (!list) throw new NotFoundError(ResponseMessages.WORKSPACE_NOT_FOUND)
    return list
  }
  async updatePermission(workspaceId: string, userId: string, permission: string): Promise<void> {
    console.log("calling", workspaceId, userId, permission)
    await this._workspaceRepository.updatePermissions(stringToMongoObj(workspaceId), stringToMongoObj(userId), permission);

  }
  async findPermission(workspaceId: string, userId: string): Promise<string> {
    const permission = await this._workspaceRepository.findPermisssion(stringToMongoObj(workspaceId), stringToMongoObj(userId));
    console.log(permission, "Permissionsssss")
    return permission
  }
  async updateUserInWorkspace(workspaceId: string, userId: string, data: UserInWorkspaceDTO): Promise<void> {
    console.log(data,userId,workspaceId,"++++++++++")
    await this._workspaceRepository.updateUserDataInWorkspace(stringToMongoObj(workspaceId),stringToMongoObj(userId),data)
  }
  async workspaceUserStatus(workspaceId: Types.ObjectId, userId: Types.ObjectId): Promise<UserInWorkspaceDTO | null> {
    const status=await this._workspaceRepository.findUserStatusInWorkspace(userId,workspaceId);
    return status
  }
}
