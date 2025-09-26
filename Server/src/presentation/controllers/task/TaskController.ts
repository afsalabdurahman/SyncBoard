import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { ITaskUseCase } from "../../../application/repositories/ITask";
import { HttpStatusCode } from "../../../common/errorCodes";
import { InternalServerError, NotFoundError } from "../../../utils/errors";
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
<<<<<<< HEAD
      console.log(req.body, "bosy");
      const dto = new TaskRequstDTO(req.body.newTask);

      dto.toValidate();
      const tasktEntity = await TaskMapper.toEntity(dto);
=======
      const input: TaskRequestDTO = {
        name: req.body.newTask.name,
        description: req.body.newTask.description,
        project: req.body.newTask.project,
        assignedUser: req.body.newTask.assignedUser,
        status: req.body.newTask.status,
        deadline: req.body.newTask.deadline,
        priority: req.body.newTask.priority,
        projectId: req.body.newTask.projectId,
      };
>>>>>>> dto

      const resposeDTO = this._taskUsecase.execute(input);

      // console.log(req.body, "bosdddddy");
      // const dto = new TaskRequstDTO(req.body.newTask);
      // console.log(dto, "return dto @control");
      // dto.toValidate();
      // const tasktEntity = await TaskMapper.toEntity(dto);
      // console.log(tasktEntity, "entifty from controller");

      // const savedTask = await this.taskUsecase.execute(tasktEntity);
      // const resposeDTO = TaskMapper.toRegisterDTO(savedTask);
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
<<<<<<< HEAD
      const tasks = await this.taskUsecase.getAllTasks();
  
=======
      const tasks = await this._taskUsecase.getAllTasks();
      console.log(tasks, "from@controller");
>>>>>>> dto
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
<<<<<<< HEAD
      const response = await this.taskUsecase.update(taskId, req.body.taskData);
      if (!response) {
        res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: "Task not found" });
        return;
      }
      
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
      });
=======
      const response = await this._taskUsecase.update(
        taskId,
        req.body.taskData
      );
      res.send(200);
>>>>>>> dto
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
    console.log(req.params, "req.sparams");
    try {
      const taskId = req.params.id;
      await this._taskUsecase.deleteTask(taskId);
      res.status(HttpStatusCode.OK).json(ResponseMessages.DELETE);
    } catch (error) {
      console.log(error, "final eroor");
      next(error);
    }
  }
  async findMyTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.params, "params");
      console.log(req.query, "quey");
      const alltask: any = req.query.count;
      console.log(alltask);
      const userName = req.params.username;
      if (!req.params.username) throw new NotFoundError("User not found");
      if (alltask == "all") {
<<<<<<< HEAD
        const data = await this.taskUsecase.myTask(userName, alltask);
      }
      const task = await this.taskUsecase.myTask(userName);
=======
        const data = await this._taskUsecase.myTask(userName, alltask);
      }
      const task = await this._taskUsecase.myTask(userName);
>>>>>>> dto
      console.log(task, "tasks");
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
    console.log(req.body, "nbody++++");
    const status = req.body.status;
    const taskID = req.params.id;
    console.log(taskID, status, "+++Params");
    try {
      if (!status || !taskID) throw new NotFoundError("Status not found");
      await this._taskUsecase.updateTaskStatus(taskID, status);
      res.status(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  }
  async findAllCompletedTasks(req: Request, res: Response): Promise<void> {
<<<<<<< HEAD
    const task = await this.taskUsecase.completedTask();
=======
    const task = await this._taskUsecase.completedTask();
>>>>>>> dto
    res.status(HttpStatusCode.OK).json(task);
  }
  async controllApprovalSatatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log(req.body, "Boduy+++", req.params, "+++pramm");
    try {
      const taskId = req.params.id;
      const status = req.body.status;
      const msg = req.body.msg;
      if (!taskId || !status)
        throw new NotFoundError("Task id or status not found");
<<<<<<< HEAD
      await this.taskUsecase.updateApprovalStatus(taskId, status, msg);
=======
      await this._taskUsecase.updateApprovalStatus(taskId, status, msg);
>>>>>>> dto
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
<<<<<<< HEAD
      const task = await this.taskUsecase.findTaskByProjectId(
=======
      const task = await this._taskUsecase.findTaskByProjectId(
>>>>>>> dto
        req.params.projectId
      );
      res.status(HttpStatusCode.OK).json(task);
    } catch (error) {
      next(error);
    }
  }
}
