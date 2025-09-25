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

const input:TaskRequestDTO={
  name:req.body.newTask.name,
  description:req.body.newTask.description,
  project:req.body.newTask.project,
  assignedUser:req.body.newTask.assignedUser,
  status:req.body.newTask.status,
  deadline:req.body.newTask.deadline,
  priority:req.body.newTask.priority,
  projectId:req.body.newTask.projectId,
}

const resposeDTO = this._taskUsecase.execute(input)

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
      const tasks = await this._taskUsecase.getAllTasks();
      console.log(tasks, "from@controller");
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
    console.log(req.body, "body");
    console.log(req.params, "params@contro");
    const taskId = req.params.id;
    try {
      const response = await this._taskUsecase.update(taskId, req.body.taskData);
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
      console.log(req.query,"quey");
      const alltask:any=req.query.count
      console.log(alltask)
      const userName = req.params.username;
      if (!req.params.username) throw new NotFoundError("User not found");
      if(alltask=="all") 
        { const data =await this._taskUsecase.myTask(userName,alltask)

        }
      const task = await this._taskUsecase.myTask(userName);
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
async findAllCompletedTasks(req:Request,res:Response):Promise<void>{
const task= await this._taskUsecase.completedTask()
res.status(HttpStatusCode.OK).json(task)

}
async controllApprovalSatatus(req:Request,res:Response,next:NextFunction){
  console.log(req.body,"Boduy+++",req.params,"+++pramm")
  try {
      const taskId=req.params.id;
  const status=req.body.status;
  const msg =req.body.msg;
  if(!taskId||!status) throw new NotFoundError("Task id or status not found")
  await this._taskUsecase.updateApprovalStatus(taskId,status,msg)
  res.status(HttpStatusCode.OK).json({message:"Updated"})
  } catch (error) {
    next(error)
  }

}
async findTaskByProject(req:Request,res:Response,next:NextFunction):Promise<void>{
  try {
    if(!req.params.projectId) throw new NotFoundError("Id is not found")
    const task = await this._taskUsecase.findTaskByProjectId(req.params.projectId)
res.status(HttpStatusCode.OK).json(task)
  } catch (error) {
    next(error)
  }
  
}
}
