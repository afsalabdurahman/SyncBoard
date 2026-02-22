import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../common/errorCodes";
import { NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ISentInvitaion } from "../../../application/repositories/imail/ISentInvitation";
import { IWokspaceMember } from "../../../application/repositories/IWorkspaceMembers";
import { WorkspaceRequestDTO } from "../../../application/dto/WorkspaceDTOs";
import { IWorkspace } from "../../../application/repositories/iworkspace/IWorkspace";
import { IAbuseUsecase } from "../../../application/repositories/IAbuse";
import { AbuseRequestDTO, UpdateAbuseStatusDTO } from "../../../application/dto/AbuseDTO";
import { workerData } from "worker_threads";
import { request } from "http";
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

  async Create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const input: WorkspaceRequestDTO = req.body

    try {

      const workspaceResponseDTO = await this._createWorkspceUsecases.createWorkspace(input);

      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.CREATED, workspaceResponseDTO });

    } catch (error) {
      next(error);
    }
  }
  async inviteMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {


    const { emails, invitationLink } = req.body;
    try {
      const isSend = await this._sentInvitaionUsecase.send(
        emails,
        invitationLink
      );
      res.status(HttpStatusCode.OK).json(ResponseMessages.INVITAION_SEND);
    } catch (error) {
      next(error);
    }
  }
  async getAllMembersData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const slug = req.params.workspaceslug;
    try {
      const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
      const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
      const skip = (page - 1) * limit;
      const workspaceData = await this._workspaceUsecase.getWorkspceDate(slug);
      res.status(HttpStatusCode.OK).json(workspaceData);
    } catch (error) {
      next(error);
    }
  }
  async pagination(req: Request, res: Response): Promise<void> {

    const slug = req.params.workspaceslug;
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
    const { items, totalItems } = await this._workspaceUsecase.paginationWorkspace(slug, page, limit, skip)
    res.status(200).json({
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    })
  }
  async updateWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workspaceId = req.params.id
      const merge = req.body
      await this._createWorkspceUsecases.updateWorkspaceData(workspaceId, merge)
      res.status(HttpStatusCode.OK).json({ message: "Updated" })
    } catch (error) {
      next(error)
    }
  }
  async abuseReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
    
      const input: AbuseRequestDTO = req.body
      const userId = req.params.id
      const workspaceId = req.params.workspaceid
      await this._abuseUsecase.execute(input, userId, workspaceId)
      res.status(HttpStatusCode.CREATED).json(ResponseMessages.CREATED)
    } catch (error) {
      next(error)
    }
  }
  async finAbuseReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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
    } catch (error) {
      next(error)
    }
  }
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const reportId = req.params.id;
      const input = req.body as UpdateAbuseStatusDTO;

      await this._abuseUsecase.updateStatus(input, reportId)
      res.status(HttpStatusCode.CREATED).json({ message: ResponseMessages.SUCCESS })
    } catch (error) {
      next(error)
    }


  }
  async listOfAbuseReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
      const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
      const skip = (page - 1) * limit;
      const userid = req.params.userid;
      const workspaceid = req.params.workspaceid;

      const { mappedReponse, docsize } = await this._abuseUsecase.listOfReports(page, limit, skip, userid, workspaceid);
      res.status(HttpStatusCode.OK).json({ data: mappedReponse, count: docsize })


    } catch (error) {
      next(error)
    }

  }

  async searchReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = req.query.q as string
      const userid = req.params.userid;
      const workspaceid = req.params.workspaceid;
      const result = await this._abuseUsecase.searchReport(q, workspaceid, userid);
      res.status(HttpStatusCode.OK).json({ data: result })
    } catch (error) {
      next(error)
     }
  }



  async downloadWorkerData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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
    } catch (error) {
      next(error)
    }
  }
  async findUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug;
      const query = req.query.query as string;
      const user = await this._workspaceUsecase.getMembers(slug, query);

        res.status(HttpStatusCode.OK).json(user);
    } catch (error) {
      next(error)
    }
  }


}
