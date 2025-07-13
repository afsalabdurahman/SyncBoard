import { CreateWorkspaceUsecases } from "../../../application/use-cases/workspace/CreateWorkspaceUsecase";
import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { slugify } from "../../../utils/slug";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import {IUserRepository} from "../../../domain/interfaces/repositories/IUserRepository"
import {SentInvitaion} from"../../../application/use-cases/invitation/SentInvitaion"

@injectable()
export class WorkspaceController {
  constructor(
    @inject("WorkspaceuseCases")
    private createWorkspceUsecases: CreateWorkspaceUsecases,
  @inject('UserRepository')private userRepository:IUserRepository,
  @inject (SentInvitaion) private sentInvitaion:SentInvitaion
  ) {}

  async Create(req: Request, res: Response): Promise<void> {
  let dataEmail=await this.userRepository.findByEmail(req.body.email)
  console.log(dataEmail,"email is data find");

    console.log(req.body,"from controlle")
    let { WorkspaceName, slug, role, ownerId,title } = req.body;
    let slugfyied = slugify(slug);
    console.log(slug);
    let data = {
      name:WorkspaceName,
      slug: slugfyied,
      role,
      ownerId,
      members:[{userId:ownerId,title:title}]
    };
    try {
      let WorkSpace = await this.createWorkspceUsecases.createWorksapce(data);
      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.CREATED, WorkSpace });
    } catch (error) {
        console.log(error,"erro controller")
      res.status(HttpStatusCode.CONFLICT).json({ error });
    }
  }
  async inviteMembers(req:Request,res:Response): Promise<void>{
    let {email,invitaionLink}=req.body
    console.log(req.body,"bodyy")
    try {
      this.sentInvitaion.Send(email,invitaionLink)
    } catch (error) {
      console.log(error,"controller")
    }

res.status(200).json("done")
  }
}
