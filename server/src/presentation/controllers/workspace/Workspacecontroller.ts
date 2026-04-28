import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ISentInvitaion } from "../../../application/repositories/imail/ISentInvitation";
import { IWokspaceMember } from "../../../application/repositories/IWorkspaceMembers";
import { WorkspaceRequestDTO } from "../../../application/dto/WorkspaceDTOs";
import { IWorkspace } from "../../../application/repositories/iworkspace/IWorkspace";
import { IAbuseUsecase } from "../../../application/repositories/IAbuse";
import { AbuseRequestDTO, UpdateAbuseStatusDTO } from "../../../application/dto/AbuseDTO";

@injectable()
export class WorkspaceController {
  constructor(
    @inject("WorkspaceuseCases")
    private _createWorkspceUsecases: IWorkspace,
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("SentInvitaion") private _sentInvitaionUsecase: ISentInvitaion,
    @inject("IWokspaceMember") private _workspaceUsecase: IWokspaceMember,
    @inject("AbuseUsecase") private _abuseUsecase: IAbuseUsecase

  ) { }

  async Create(req: Request, res: Response, ): Promise<void> {
    const input: WorkspaceRequestDTO = req.body
      const workspaceResponseDTO = await this._createWorkspceUsecases.createWorkspace(input);
      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.CREATED, workspaceResponseDTO });   
  }
  async inviteMembers(
    req: Request,
    res: Response,  
  ): Promise<void> {
    const { emails, invitationLink,workspaceId } = req.body;
       await this._sentInvitaionUsecase.send(
        emails,
        invitationLink,
        workspaceId
      );
      res.status(HttpStatusCode.OK).json(ResponseMessages.INVITATION_SENT);
  }
  async getAllMembersData(
    req: Request,
    res: Response,   
  ): Promise<void> {
    const slug = req.params.workspaceslug as string
      const workspaceData = await this._workspaceUsecase.getWorkspceDate(slug);
      res.status(HttpStatusCode.OK).json(workspaceData);
  }
  async pagination(req: Request, res: Response): Promise<void> {
console.log("userIsCalling...")
    const slug = req.params.workspaceslug as string
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
      const projectId = (req.query.projectId as string | null) ?? null;
    const { items, totalItems } = await this._workspaceUsecase.paginationWorkspace(slug, page, limit, skip,projectId)
    res.status(200).json({
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    })
  }
  async updateWorkspace(req: Request, res: Response,): Promise<void> {
      const workspaceId = req.params.id as string
      const merge = req.body;
      await this._createWorkspceUsecases.updateWorkspaceData(workspaceId, merge)
      res.status(HttpStatusCode.OK).json({ message: "Updated" })
    
  }
  async abuseReport(req: Request, res: Response): Promise<void> {
      const input: AbuseRequestDTO = req.body
      const userId = req.params.id as string
      const workspaceId = req.params.workspaceid as string
      await this._abuseUsecase.execute(input, userId, workspaceId)
      res.status(HttpStatusCode.CREATED).json(ResponseMessages.CREATED)
    
  }
  async finAbuseReports(req: Request, res: Response): Promise<void> {
   
      const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
      const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
      const skip = (page - 1) * limit;
      const responseDTO = await this._abuseUsecase.findAbuseReports(page, limit, skip)
      res.status(HttpStatusCode.OK).json({
        Data: responseDTO,
        currentPage: page,
        totalPages: Math.ceil(responseDTO.count / limit),
        totalItems: responseDTO.count,
      })
   
  }
  async updateStatus(req: Request, res: Response, ): Promise<void> {
      const reportId = req.params.id as string
      const input = req.body as UpdateAbuseStatusDTO;
      await this._abuseUsecase.updateStatus(input, reportId)
      res.status(HttpStatusCode.CREATED).json({ message: ResponseMessages.SUCCESS })
  }
  async listOfAbuseReports(req: Request, res: Response): Promise<void> {
     const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
      const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
      const skip = (page - 1) * limit;
      const userid = req.params.userid;
      const workspaceid = req.params.workspaceid;

      const { mappedReponse, docsize } = await this._abuseUsecase.listOfReports(page, limit, skip, userid, workspaceid);
      res.status(HttpStatusCode.OK).json({ data: mappedReponse, count: docsize })
  }

  async searchReports(req: Request, res: Response): Promise<void> {
   
      const q = req.query.q as string
      const userid = req.params.userid as string
      const workspaceid = req.params.workspaceid as string
      const result = await this._abuseUsecase.searchReport(q, workspaceid, userid);
      res.status(HttpStatusCode.OK).json({ data: result })
    
  }



  async downloadWorkerData(req: Request, res: Response): Promise<void> {
   
      const excelBuffer: Buffer = await this._createWorkspceUsecases.generateWorkspaceExcel();
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="workspaces.xlsx"'
      );
      res.setHeader('Content-Length', excelBuffer.length);
      res.send(excelBuffer);
    
  }
  async findUser(req: Request, res: Response): Promise<void> {
    
      const slug = req.params.slug;
      const query = req.query.query as string;
      const user = await this._workspaceUsecase.getMembers(slug, query);
      res.status(HttpStatusCode.OK).json(user);
  }


}
