import { CreateWorkspaceUsecases } from "../../../application/use-cases/workspace/CreateWorkspaceUsecase";
import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { slugify } from "../../../utils/slug";
import { HttpStatusCode } from "../../../common/errorCodes";
import { CustomError, NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { IActivity } from "../../../application/repositories/IActivity";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ISentInvitaion } from "../../../application/repositories/imail/ISentInvitation";
import { IWokspaceMember } from "../../../application/repositories/IWorkspaceMembers";

@injectable()
export class WorkspaceController {
  constructor(
    @inject("WorkspaceuseCases")
    private createWorkspceUsecases: CreateWorkspaceUsecases,
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("SentInvitaion") private sentInvitaionUsecase: ISentInvitaion,
    @inject("IWokspaceMember") private IworkspaceUsecase: IWokspaceMember,
    @inject("ActivityUsecase") private activityUsecase: IActivity
  ) {}

  async Create(req: Request, res: Response, next: NextFunction): Promise<void> {
    let { email, WorkspaceName, slug, role, ownerId, title } = req.body;
    try {
      let dataEmail = await this.userRepository.findByEmail(email);

      if (!dataEmail) throw new NotFoundError();

      let slugfyied = slugify(slug);
      let data = {
        name: WorkspaceName,
        slug: slugfyied,
        role,
        ownerId,
        members: [{ userId: ownerId, title: title }],
      };

      let WorkSpace = await this.createWorkspceUsecases.createWorksapce(
        data,
        dataEmail?._id,
        "title",
        title
      );
      console.log(WorkSpace, "++++workspce");
      if (!WorkSpace)
        throw new CustomError(
          "something went to wrong",
          HttpStatusCode.CONFLICT
        );
      //push add work pace under user)
      let addToWorkspace = await this.userRepository.addToWorkspace(
        dataEmail._id,
        WorkSpace.isCreate._id,
        dataEmail.role
      );

      const logMessage = await this.activityUsecase.execute(
        WorkSpace.isCreate._id,
        WorkspaceName,
        dataEmail?.name
      );
      console.log(logMessage, "messagelog");
      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.CREATED, WorkSpace, addToWorkspace });
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
      const isSend = await this.sentInvitaionUsecase.send(
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
      let workspaceData = await this.IworkspaceUsecase.getWorkspceDate(slug);
      console.log(workspaceData, "workspcedata");
      if (!workspaceData) throw new NotFoundError("Workspace not found");
      res.status(HttpStatusCode.OK).json(workspaceData);
    } catch (error) {
      next(error);
    }
  }
}
