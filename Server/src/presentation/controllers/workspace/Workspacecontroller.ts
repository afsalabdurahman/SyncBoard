import { CreateWorkspaceUsecases } from "../../../application/use-cases/workspace/CreateWorkspaceUsecase";
import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
// import { slugify } from "../../../utils/slug";
import { HttpStatusCode } from "../../../common/errorCodes";
import { CustomError, NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { IActivity } from "../../../application/repositories/IActivity";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ISentInvitaion } from "../../../application/repositories/imail/ISentInvitation";
import { IWokspaceMember } from "../../../application/repositories/IWorkspaceMembers";
import { WorkspaceRequestDTO } from "../../../application/dto/WorkspaceDTOs";
import { IWorkspace } from "../../../application/repositories/iworkspace/IWorkspace";
@injectable()
export class WorkspaceController {
  constructor(
    @inject("WorkspaceuseCases")
    private _createWorkspceUsecases: IWorkspace,
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("SentInvitaion") private _sentInvitaionUsecase: ISentInvitaion,
    @inject("IWokspaceMember") private _workspaceUsecase: IWokspaceMember,
    
  ) {}

  async Create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const input: WorkspaceRequestDTO = {
      email: req.body.email,
      ownerId: req.body.ownerId,
      slug: req.body.slug,
      title: req.body.title,
      role: req.body.role,
      workspaceName: req.body.WorkspaceName,
    };
    console.log(req.body,"bodyyyy")
    try {
      if (
        !input.email ||
        !input.ownerId ||
        !input.slug ||
        !input.title ||
        !input.workspaceName
      )
        throw new NotFoundError("Data is not Found");

      const workspaceResponseDTO = await this._createWorkspceUsecases.createWorkspace(input);

      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.CREATED,workspaceResponseDTO  });
      
    } catch (error) {
      next(error);
    }
  }
  async inviteMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log(req.body, "sent email");

    const { emails, invitationLink } = req.body;
    try {
      const isSend = await this._sentInvitaionUsecase.send(
        emails,
        invitationLink
      );
      if (isSend)
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
    let slug = req.params.workspaceslug;
    try {
      console.log(slug,"slug @Controlller")
      let workspaceData = await this._workspaceUsecase.getWorkspceDate(slug);
      console.log(workspaceData, "workspcedata");
      if (!workspaceData) throw new NotFoundError("Workspace not found");
      res.status(HttpStatusCode.OK).json(workspaceData);
    } catch (error) {
      next(error);
    }
  }
}
