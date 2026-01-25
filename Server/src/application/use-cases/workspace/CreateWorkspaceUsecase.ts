import { injectable, inject } from "tsyringe";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import ExcelJS from "exceljs"
import {excelWorkspaceModel} from "../../../utils/excelModel"
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
  WorkspaceRequestDTO,
  WorkspaceResponseDTO,
} from "../../dto/WorkspaceDTOs";
import { slugify } from "../../../utils/slug";
import { WorkspaceMapper } from "../../mappers/WorkspaceMapper";
import { Workspace } from "../../../domain/entities/Workspace";
import { WorkspaceDoument } from "../../../infrastructure/database/models/WorkspaceModel";
import { ISuscription } from "../../../domain/interfaces/repositories/ISuscriptionRepository";


@injectable()
export class CreateWorkspaceUsecases implements IWorkspace {
  constructor(
    @inject("WorkspaceRepository")
    private _workspaceRepository: IWorkspaceRepository,
    @inject("IUserRepository") private _userRepository: IUserRepository,
      @inject("SuscriptionRepository")
        private _suscriptionRepository: ISuscription,
  ) {}

  async createWorkspace(
    input: WorkspaceRequestDTO
  ): Promise<WorkspaceResponseDTO> {
 console.log(input)
  const isValid =  WorkspaceMapper.validateWorkspace(input);
     if (!isValid.success) throw new ValidationError(ResponseMessages.INVALID_INPUT);
    const user = await this._userRepository.findByEmail(input.email);

    if (!user) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
    const slugfyied = slugify(input.slug);
    input.slug = slugfyied;

    const workspaceEntity = WorkspaceMapper.mapWorkspaceToEntity(
      input,
      user._id??"",
      input.title
    );
  
    const isCreateWorkspace =await this._workspaceRepository.create(workspaceEntity);
    if (!isCreateWorkspace || !isCreateWorkspace._id)
      throw new ValidationError(ResponseMessages.NOT_FOUND + ' Workspace');

    const updatedUser = await this._userRepository.addToWorkspace(
      user._id??"",
      isCreateWorkspace._id,
      input.title
    );
    if (!updatedUser) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
 
    return WorkspaceMapper.mapEntityToWorkspace(updatedUser, isCreateWorkspace);
  }

  async findWorkspace(id: Types.ObjectId): Promise<Workspace|null> {
    let data = await this._workspaceRepository.findByObjectId(id);
   
    return data;
  }
  async updateWorkspace(
    id: Types.ObjectId,
    logId: Types.ObjectId
  ): Promise<boolean> {
    if (!this._workspaceRepository.addlogId) throw new NotFoundError(ResponseMessages.NOT_FOUND);
    const result = this._workspaceRepository.addlogId(id, logId);
    if (!result) throw new InternalServerError(ResponseMessages.CONFLICT);
    return true;
  }

async updateWorkspaceData(id: string, merge:Record<string,string>): Promise<void> {
  console.log(merge,"555")
  if(merge.plan){
    await this._suscriptionRepository.updateSubscriptionPlanBysuper(merge.name,merge.plan);
    
  }else{
  const data=await this._workspaceRepository.updateWorkspaceDate(id,merge)
  }


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
      ?.map((m: any) => m.title || 'Unknown')
      .filter(Boolean)
      .join(', ') || 'No members';

    const memberUserIds = space.members
      ?.map((m: any) => m.userId)
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

}
