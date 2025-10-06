import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { IProjectUsecase } from "../../../application/repositories/IProject";
import { ProjectRequstDTO } from "../../../application/dto/ProjectDTOs";

import { HttpStatusCode } from "../../../common/errorCodes";
import { InternalServerError, NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { IActivity } from "../../../application/repositories/IActivity";
@injectable()
export class ProjectController {
  constructor(
    @inject("ProjectUsecase") private _projectUsecase: IProjectUsecase,
    @inject("ActivityUsecase") private activityUsecase: IActivity
  ) {}

  async createProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const input: ProjectRequstDTO = {
        name: req.body.newProject.name,
        description: req.body.newProject.description,
        assignedUsers: req.body.newProject.assignedUsers,
        deadline: req.body.newProject.deadline,
        status: req.body.newProject.status,
        priority: req.body.newProject.priority,
        clientName: req.body.newProject.clientName,
        projectAdminId: req.body.newProject.projectAdminId,
        attachedUrl: req.body.newProject.attachedUrl,
      };

      const ResponseDTO = await this._projectUsecase.excute(input);

      res.status(HttpStatusCode.CREATED).json({ message: ResponseDTO });
    } catch (error) {
      next(error);
    }
   
  }
  async allProjects(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const projects = await this._projectUsecase.getAllProjects();
      res.status(HttpStatusCode.OK).json(projects);
    } catch (error) {
      console.log(error, "error from get projects");
      next(error);
    }
  }
  async removeAttchmentInProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.body, "body");
      console.log(req.params, "parms");
      if (!req.params.projectId || !req.params.encodedUrl)
        throw new NotFoundError("Prams not found");

      const projectId = req.params.projectId;
      const attachedUrl = req.params.encodedUrl;

      await this._projectUsecase.removeAttachment(projectId, attachedUrl);

      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.ATTACHEMNT_REMOVE });
    } catch (error) {
      console.log(error, "error from comntoller");
      next(error);
    }
  }
  async updateProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log(req.body, "biodyyyy");
    console.log(req.params, "params@contro");
    const projectId = req.params.id;
    const responseFromUsecas = await this._projectUsecase.update(
      projectId,
      req.body.editingProject
    );
    console.log(responseFromUsecas);
    res.send(200);
  }

  async deleteProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const projectId = req.params.id;
      if (!projectId) throw new NotFoundError("ProjectId not found");
      console.log(req.params);
      await this._projectUsecase.deleteProject(projectId);
      res.status(HttpStatusCode.OK).json(ResponseMessages.DELETE);
    } catch (error) {
      next(error);
    }
  }
 async pagination (req: Request,
    res: Response,
    next: NextFunction):Promise<void> {
try {
  console.log("callinngg... pagination")
     const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;

    console.log(page,limit,skip)
const {items,totalItems} =await this._projectUsecase.paginationProjecust(page,limit,skip)
res.status(200).json({
  items,
  currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
})
} catch (error) {
  console.log(error,"error pagination")
}
 }
}
