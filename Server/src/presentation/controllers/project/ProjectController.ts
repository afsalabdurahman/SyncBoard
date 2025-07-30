import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { IProjectUsecase } from "../../../application/repositories/IProject";
import { Project } from "../../../domain/entities/Project";
import { ProjectRequstDTO } from "../../dots/projectDTO/requestDTO";

import { ProjectMapper } from "../../dots/projectDTO/projectMapper";
import { HttpStatusCode } from "../../../common/errorCodes";
import { InternalServerError, NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";

@injectable()
export class ProjectController {
  constructor(
    @inject("ProjectUsecase") private projectUsecase: IProjectUsecase
  ) {}

  async createProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = new ProjectRequstDTO(req.body.newProject);
      dto.toValidate();

      const projectEntity = ProjectMapper.toEntity(dto);

      const savedProject = await this.projectUsecase.excute(projectEntity);

      const resposeDTO = ProjectMapper.toRegisterDTO(savedProject);

      res.status(HttpStatusCode.CREATED).json(resposeDTO);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async allProjects(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {

      const projects = await this.projectUsecase.getAllProjects();
      res.status(HttpStatusCode.OK).json(projects);

    } catch (error) {
      console.log(error, "error from get projects");
      next(error);
    }
  }
 async removeAttchmentInProject (req:Request,res:Response,next:NextFunction):Promise<void>{
  try {
    console.log(req.body,"body")
    console.log(req.params,"parms")
     if(!req.params.projectId || !req.params.encodedUrl)  throw new NotFoundError("Prams not found");
   
    const projectId =req.params.projectId;
    const attachedUrl = req.params.encodedUrl;

    await this.projectUsecase.removeAttachment(projectId,attachedUrl);
  
    res.status(HttpStatusCode.OK).json({message:ResponseMessages.ATTACHEMNT_REMOVE})
  }
  catch (error) {
    console.log(error,"error from comntoller")
    next(error)
  }
  }
  async updateProject(req:Request,res:Response,next:NextFunction):Promise<void>{
    console.log(req.body,"biodyyyy")
    console.log(req.params,"params@contro")
    const projectId=req.params.id;
   const responseFromUsecas =await this.projectUsecase.update(projectId,req.body.editingProject)
   console.log(responseFromUsecas,)
   res.send(200)
  }
  
  async deleteProject(req:Request,res:Response,next:NextFunction):Promise<void>{
   try {
     const projectId=req.params.id
     if(!projectId) throw new NotFoundError("ProjectId not found")
    console.log(req.params)
    await this.projectUsecase.deleteProject(projectId)
    res.status(HttpStatusCode.OK).json(ResponseMessages.DELETE)
   } catch (error) {
    next(error)
   }
   
    
  }
 
 }


