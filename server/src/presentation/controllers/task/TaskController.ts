import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { ITaskUseCase } from "../../../application/repositories/ITask";
import { HttpStatusCode } from "../../../common/errorCodes";
import {  NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { TaskRequestDTO } from "../../../application/dto/TaskDTOs";
import { CustomRequest } from "../../types/CustomRequest";
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

      const resposeDTO = await this._taskUsecase.execute(input);
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
      const responseDTO = await this._taskUsecase.update(
        taskId,
        req.body.updatedTask
      );
      
      res.status(HttpStatusCode.OK).json(responseDTO);
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
     
      const alltask = req.query.count;
      const userName = req.params.username;
      if (!req.params.username) throw new NotFoundError("User "+ResponseMessages.NOT_FOUND);
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
    const workspaceid = req.params.workspaceid;
    console.log(workspaceid,"+++WORKDPACEID")
    const task = await this._taskUsecase.completedTask(workspaceid);
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
      console.log(req.query,"quer112")
      const filter=req.query.filter as string
      const task = await this._taskUsecase.findTaskByProjectId(
        req.params.projectId,
        filter
      );
      res.status(HttpStatusCode.OK).json(task);
    } catch (error) {
      next(error);
    }
  }
async pagination (req:CustomRequest,res:Response):Promise<void> {
 const workspaceId= req.params.workspaceid;
 console.log(workspaceId,"786Works")
     const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
const {items,totalItems} =await this._taskUsecase.paginationTask(workspaceId,page,limit,skip)
res.status(200).json({
  items,
  currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
})
}
async addComment(req:Request,res:Response,next:NextFunction):Promise<void>{
  try {
   const taskId=req.params.id;
    const comment = req.body;
    console.log(req.body,req.params)
await this._taskUsecase.addComment(taskId,comment)
res.status(HttpStatusCode.CREATED).json({message:"Comment added"})
  } catch (error) {
    console.log(error,"error")
    next(error)
  }
}
async getCommentsById(req:Request,res:Response,next:NextFunction):Promise<void>{
 try {
   const taskId= req.params.id;
   console.log(taskId,"taskID")
   const responseDTO = await this._taskUsecase.getTaskComments(taskId)
   res.status(HttpStatusCode.OK).json({data:responseDTO})
 } catch (error) {
  console.log(error)
  next(error)
 }

}
async deleteAttachment(req:Request,res:Response,next:NextFunction):Promise<void>{
  try {
    const taskId=req.params.taskid;
    const url=req.body.attachment;
    console.log(taskId,url,req.body,req.params)
   const  deleteMsg=await this._taskUsecase.deleteAttachment(taskId,url)
res.status(HttpStatusCode.OK).json({message:deleteMsg})
  } catch (error) {
    next(error)
  }
}

}
