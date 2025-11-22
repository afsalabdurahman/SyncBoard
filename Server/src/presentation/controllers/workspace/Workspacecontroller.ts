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
import { IAbuseUsecase } from "../../../application/repositories/IAbuse";
import { AbuseRequestDTO } from "../../../application/dto/AbuseDTO";
@injectable()
export class WorkspaceController {
  constructor(
    @inject("WorkspaceuseCases")
    private _createWorkspceUsecases: IWorkspace,
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("SentInvitaion") private _sentInvitaionUsecase: ISentInvitaion,
    @inject("IWokspaceMember") private _workspaceUsecase: IWokspaceMember,
    @inject("AbuseUsecase") private _abuseUsecase:IAbuseUsecase
    
  ) {}

  async Create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const input: WorkspaceRequestDTO = req.body 
   
    try {
  
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
 
      let workspaceData = await this._workspaceUsecase.getWorkspceDate(slug);
     
      if (!workspaceData) throw new NotFoundError("Workspace not found");
      res.status(HttpStatusCode.OK).json(workspaceData);
    } catch (error) {
      next(error);
    }
  }
async pagination (req:Request,res:Response):Promise<void> {
const slug = req.params.workspaceslug;
     const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
const {items,totalItems} =await this._workspaceUsecase.paginationWorkspace(slug,page,limit,skip)
res.status(200).json({
  items,
  currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
})
}
async updateWorkspace(req:Request,res:Response,next:NextFunction):Promise<void>{
  try {
    console.log(req.body,"body",req.params.id)
    const workspaceId = req.params.id
    const merge = req.body
    console.log(workspaceId,"body",merge)
   await this._createWorkspceUsecases.updateWorkspaceData(workspaceId,merge)
   res.status(HttpStatusCode.OK).json({message:"Updated"})
  } catch (error) {
    next(error)
  }
}
async abuseReport(req:Request,res:Response,next:NextFunction):Promise<void>{
try {
  const input:AbuseRequestDTO=req.body
  const userId=req.params.id
  console.log(userId,"req")
 await this._abuseUsecase.execute(input,userId)
res.status(HttpStatusCode.CREATED).json(ResponseMessages.CREATED)
} catch (error) {
  console.log(error)
  next(error)
}
}

}
