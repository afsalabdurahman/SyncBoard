import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { ITaskUseCase } from "../../../application/repositories/ITask";
import { HttpStatusCode } from "../../../common/errorCodes";
import {  NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { TaskRequestDTO } from "../../../application/dto/TaskDTOs";
@injectable()
export class TaskController {
  constructor(@inject("TaskUsecase") private _taskUsecase: ITaskUseCase) {}

  async createTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const input: TaskRequestDTO = req.body.newTask as TaskRequestDTO

      const resposeDTO = this._taskUsecase.execute(input);
      res.status(HttpStatusCode.CREATED).json(resposeDTO);
      
    } catch (error) {
      next(error);
    }
  }
  async allTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tasks = await this._taskUsecase.getAllTasks();

      res.status(HttpStatusCode.OK).json(tasks);
    } catch (error) {
      next(error);
    }
  }
  async updateTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const taskId = req.params.id;
    try {
      const response = await this._taskUsecase.update(
        taskId,
        req.body.taskData
      );
      res.send(200);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async deleteTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    try {
      const taskId = req.params.id;
      await this._taskUsecase.deleteTask(taskId);
      res.status(HttpStatusCode.OK).json(ResponseMessages.DELETE);
    } catch (error) {
   
      next(error);
    }
  }
  async findMyTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
     
      const alltask: any = req.query.count;
      console.log(alltask);
      const userName = req.params.username;
      if (!req.params.username) throw new NotFoundError("User not found");
      if (alltask == "all") {
        const data = await this._taskUsecase.myTask(userName, alltask);
      }
      const task = await this._taskUsecase.myTask(userName);

      res.status(HttpStatusCode.OK).json(task);
    } catch (error) {
      next(error);
    }
  }
  async updateTaskStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
   
    const status = req.body.status;
    const taskID = req.params.id;
 
    try {
      if (!status || !taskID) throw new NotFoundError("Status not found");
      await this._taskUsecase.updateTaskStatus(taskID, status);
      res.status(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  }
  async findAllCompletedTasks(req: Request, res: Response): Promise<void> {
    const task = await this._taskUsecase.completedTask();
    res.status(HttpStatusCode.OK).json(task);
  }
  async controllApprovalSatatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
 
    try {
      const taskId = req.params.id;
      const status = req.body.status;
      const msg = req.body.msg;
      if (!taskId || !status)
        throw new NotFoundError("Task id or status not found");
      await this._taskUsecase.updateApprovalStatus(taskId, status, msg);
      res.status(HttpStatusCode.OK).json({ message: "Updated" });
    } catch (error) {
      next(error);
    }
  }
  async findTaskByProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.params.projectId) throw new NotFoundError("Id is not found");
      const task = await this._taskUsecase.findTaskByProjectId(
        req.params.projectId
      );
      res.status(HttpStatusCode.OK).json(task);
    } catch (error) {
      next(error);
    }
  }
async pagination (req:Request,res:Response):Promise<void> {

     const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
const {items,totalItems} =await this._taskUsecase.paginationTask(page,limit,skip)
res.status(200).json({
  items,
  currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
})
}

}
