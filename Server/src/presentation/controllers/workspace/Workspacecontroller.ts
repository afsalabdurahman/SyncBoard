import { CreateWorkspaceUsecases } from "../../../application/use-cases/workspace/CreateWorkspaceUsecase";
import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { slugify } from "../../../utils/slug";
import { HttpStatusCode } from "../../../common/errorCodes";
import { CustomError, NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { SentInvitaion } from "../../../application/use-cases/invitation/SentInvitaion";
import { workerData } from "worker_threads";
import { ObjectId, Types } from "mongoose";
import {IWokspaceMember} from "../../../application/repositories/IWorkspaceMembers"
@injectable()
export class WorkspaceController {
  constructor(
    @inject("WorkspaceuseCases")
    private createWorkspceUsecases: CreateWorkspaceUsecases,
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject(SentInvitaion) private sentInvitaion: SentInvitaion,
    @inject ("IWokspaceMember") private IworkspaceUsecase:IWokspaceMember
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

      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.CREATED, WorkSpace, addToWorkspace });
    } catch (error) {
      next(error);
    }
  }
  async inviteMembers(req: Request, res: Response): Promise<void> {
    console.log(req.body, "sent email");
    // let email = req.body.emails[0].email;
    let invitationLink = req.body.invitationLink;
    console.log(invitationLink);
    let emails = req.body.emails;

    try {
      await Promise.all(
        emails.map((singleEmail: string) =>
          this.sentInvitaion.Send(singleEmail, invitationLink)
        )
      );
    } catch (error) {
      console.log(error, "controller");
    }

    res.status(200).json("done");
  }
  async getAllMembersData(
    req: Request,
    res: Response,
    next: NextFunction): Promise<void> {
    let slug = req.params.workspaceslug;
    console.log(slug,"sluggg@@@@@@@@@")
    let workspaceData=await this.IworkspaceUsecase.getWorkspceDate(slug)
    res.status(200).json(workspaceData)
    
  }
}
