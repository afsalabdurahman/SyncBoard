import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";

import { ITaskUseCase } from "../../../application/repositories/ITask";
import { HttpStatusCode } from "../../../common/errorCodes";
import { NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { TaskRequestDTO } from "../../../application/dto/TaskDTOs";
import { CustomRequest } from "../../types/CustomRequest";
@injectable()
export class TaskController {
  constructor(@inject("TaskUsecase") private _taskUsecase: ITaskUseCase) { }
  async createTask(
    req: Request,
    res: Response,
  ): Promise<void> {
    const input: TaskRequestDTO = req.body.newTask as TaskRequestDTO
    const resposeDTO = await this._taskUsecase.execute(input);
    res.status(HttpStatusCode.CREATED).json(resposeDTO);
  }
  async allTasks(
    req: Request,
    res: Response,
  ): Promise<void> {
    const tasks = await this._taskUsecase.getAllTasks();
    res.status(HttpStatusCode.OK).json(tasks);
  }
  async updateTask(
    req: Request,
    res: Response,
  ): Promise<void> {
    const taskId = req.params.id as string
    const responseDTO = await this._taskUsecase.update(
      taskId,
      req.body.updatedTask
    );
    res.status(HttpStatusCode.OK).json(responseDTO);
  }
  async deleteTask(
    req: Request,
    res: Response,
  ): Promise<void> {
    const taskId = req.params.id as string
    await this._taskUsecase.deleteTask(taskId);
    res.status(HttpStatusCode.OK).json(ResponseMessages.DELETED);
  }
  async findMyTask(
    req: Request,
    res: Response,
  ): Promise<void> {
    const alltask = req.query.count as string
    const userName = req.params.username as string
    if (!req.params.username) throw new NotFoundError("User " + ResponseMessages.NO_CONTENT);
    if (alltask == "all") {
      await this._taskUsecase.myTask(userName, alltask);
    }
    const task = await this._taskUsecase.myTask(userName);
    res.status(HttpStatusCode.OK).json(task);
  }
  async updateTaskStatus(
    req: Request,
    res: Response,
  ): Promise<void> {
    const status = req.body.status
    const taskID = req.params.id as string
    if (!status || !taskID) throw new NotFoundError("Status not found");
    await this._taskUsecase.updateTaskStatus(taskID, status);
    res.status(HttpStatusCode.OK);
  }
  async findAllCompletedTasks(req: Request, res: Response): Promise<void> {
    const workspaceid = req.params.workspaceid as string
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
    const { items, totalItems } = await this._taskUsecase.completedTask(workspaceid, page, limit, skip);
    res.status(HttpStatusCode.OK).json({
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  }
  async controllApprovalSatatus(
    req: Request,
    res: Response,
  ) {
    const taskId = req.params.id as string
    const status = req.body.status;
    const msg = req.body.msg;
    if (!taskId || !status)
      throw new NotFoundError("Task id or status not found");
    await this._taskUsecase.updateApprovalStatus(taskId, status, msg);
    res.status(HttpStatusCode.OK).json({ message: "Updated" });
  }
  async findTaskByProject(
    req: Request,
    res: Response,
  ): Promise<void> {
    if (!req.params.projectId) throw new NotFoundError("Id is not found");
    const filter = req.query.filter as string
    const task = await this._taskUsecase.findTaskByProjectId(
      req.params.projectId as string,
      filter
    );
    res.status(HttpStatusCode.OK).json(task);
  }
  async pagination(req: CustomRequest, res: Response): Promise<void> {
    const workspaceId = req.params.workspaceid as string
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
    const { items, totalItems } = await this._taskUsecase.paginationTask(workspaceId, page, limit, skip)
    res.status(200).json({
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    })
  }
  async addComment(req: Request, res: Response,): Promise<void> {
    const taskId = req.params.id as string
    const comment = req.body;
    await this._taskUsecase.addComment(taskId, comment)
    res.status(HttpStatusCode.CREATED).json({ message: "Comment added" })

  }
  async getCommentsById(req: Request, res: Response,): Promise<void> {
    const taskId = req.params.id as string
    const responseDTO = await this._taskUsecase.getTaskComments(taskId)
    res.status(HttpStatusCode.OK).json({ data: responseDTO })
  }
  async deleteAttachment(req: Request, res: Response): Promise<void> {
    const taskId = req.params.taskid;
    const url = req.body.attachment;
    const deleteMsg = await this._taskUsecase.deleteAttachment(taskId, url)
    res.status(HttpStatusCode.OK).json({ message: deleteMsg })

  }
  async deleteSubTask(req: Request, res: Response,): Promise<void> {
    const taskId = req.params.taskid as string
    const subTask = req.body.subTask;
    await this._taskUsecase.deleteSubTask(taskId, subTask);
    res.status(HttpStatusCode.OK).json({ message: ResponseMessages.SUCCESS })

  }
  async updateSubtask(req: Request, res: Response): Promise<void> {
    const taskId = req.params.taskid as string
    const title = req.body.title;
    await this._taskUsecase.updateSubtask(taskId, title);
    res.status(HttpStatusCode.OK).json({ message: ResponseMessages.SUCCESS })

  }
  async dashBoardSpecifyTask(req: Request, res: Response): Promise<void> {

    const projectId = req.params.projectid as string
    const DashboardTaskData = await this._taskUsecase.findTaskCountByProjectId(projectId);
    res.status(HttpStatusCode.OK).json(DashboardTaskData)
  }
  async donetChartData(req: Request, res: Response): Promise<void> {
    const projectId = req.params.projectid as string;
    const chartData = await this._taskUsecase.findDonetChartData(projectId);
    res.status(HttpStatusCode.OK).json({ "To Do": chartData.todo, "In Progress": chartData.inprogress, "Completed": chartData.completed })
  }
}
