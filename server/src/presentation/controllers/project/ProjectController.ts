import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IProjectUsecase } from "../../../application/repositories/IProject";
import { ProjectRequstDTO } from "../../../application/dto/ProjectDTOs";

import { HttpStatusCode } from "../../../common/errorCodes";
import { NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";

@injectable()
export class ProjectController {
  constructor(
    @inject("ProjectUsecase") private _projectUsecase: IProjectUsecase) { }

  async createProject(
    req: Request,
    res: Response,

  ): Promise<void> {
    const input: ProjectRequstDTO = req.body.newProject as ProjectRequstDTO;
    const workspaceId = req.params.workspaceid;
    const ResponseDTO = await this._projectUsecase.excute(input, workspaceId);
    res.status(HttpStatusCode.CREATED).json({ message: ResponseDTO });
  }
  async allProjects(
    req: Request,
    res: Response,
  ): Promise<void> {
  const workspaceId = req.params.workspaceid;
    const projects = await this._projectUsecase.getAllProjects(workspaceId);
    res.status(HttpStatusCode.OK).json(projects);
  }
  async removeAttchmentInProject(
    req: Request,
    res: Response,
  ): Promise<void> {
    if (!req.params.projectId || !req.params.encodedUrl)
      throw new NotFoundError("Prams not found");

    const projectId = req.params.projectId;
    const attachedUrl = req.params.encodedUrl;

    await this._projectUsecase.removeAttachment(projectId, attachedUrl);
       res.status(HttpStatusCode.OK) .json({ message: ResponseMessages.ATTACHMENT_REMOVED });

  }
  async updateProject(
    req: Request,
    res: Response,
  ): Promise<void> {

    const projectId = req.params.id;
    const responseDTO = await this._projectUsecase.update(
      projectId,
      req.body.editingProject
    );
    res.status(HttpStatusCode.OK).json(responseDTO)
  }

  async deleteProject(
    req: Request,
    res: Response,
  ): Promise<void> {

    const projectId = req.params.id;
    if (!projectId) throw new NotFoundError("ProjectId not found");
    await this._projectUsecase.deleteProject(projectId);
    res.status(HttpStatusCode.OK).json(ResponseMessages.DELETED);

  }
  async pagination(req: Request,
    res: Response,
  ): Promise<void> {

    const workspaceId = req.params.workspaceId;
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;

    const { items, totalItems } = await this._projectUsecase.paginationProjecust(workspaceId, page, limit, skip)
    res.status(200).json({
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    })
  }
  async deleteAttahedURL(req: Request, res: Response,): Promise<void> {
    const url = req.body.url;
    const projectId = req.params.projectId as string;
    await this._projectUsecase.deleteAttachment(projectId, url)
    res.status(HttpStatusCode.OK).json({ message: ResponseMessages.DELETED })
  }
}
