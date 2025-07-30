import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { TaskRequstDTO } from "../../dots/taskDTO/requestDTO";
import { TaskMapper } from "../../dots/taskDTO/taskMapper";
import {ITaskUseCase } from "../../../application/repositories/ITask";
import { HttpStatusCode } from "../../../common/errorCodes";
import { InternalServerError, NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
@injectable()
export class TaskController {
  constructor(@inject("TaskUsecase") private taskUsecase: ITaskUseCase) {}

  async createTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.body,"bosy");
      const dto = new TaskRequstDTO(req.body.newTask);
      console.log(dto,"return dto @control")
      dto.toValidate();
      const tasktEntity = await TaskMapper.toEntity(dto);
      console.log(tasktEntity,"entifty from controller")

      const savedTask = await this.taskUsecase.execute(tasktEntity);
      const resposeDTO = TaskMapper.toRegisterDTO(savedTask);
      res.status(HttpStatusCode.CREATED).json(resposeDTO);
    } catch (error) {
      console.log(error,"from final eror");
      next(error);
    }
  }
async allTasks(req:Request,res:Response,next:NextFunction):Promise<void>{
 try {
  const tasks= await this.taskUsecase.getAllTasks()
  console.log(tasks,"from@controller")
 res.status(HttpStatusCode.OK).json(tasks);
 } catch (error) {
  next(error)
 }
}
async updateTask(req:Request,res:Response,next:NextFunction):Promise<void>{
console.log(req.body,"body")
console.log(req.params,"params@contro")
 const taskId=req.params.id;
 try {
  const response = await this.taskUsecase.update(taskId,req.body.taskData)
  res.send(200)
 } catch (error) {
  console.log(error)
  next(error)
 }

}
async deleteTask(req:Request,res:Response,next:NextFunction):Promise<void>{
  console.log(req.params,"req.sparams")
  try {
    const taskId=req.params.id
    await this.taskUsecase.deleteTask(taskId)
     res.status(HttpStatusCode.OK).json(ResponseMessages.DELETE);
  } catch (error) {
    console.log(error,"final eroor")
    next(error)
  }
}
async findMyTask(req:Request,res:Response,next:NextFunction):Promise<void>{
try {
  console.log(req.params,"params")
  const userName= req.params.username;
  if(!req.params.username) throw new NotFoundError("User not found");
   const task = await this.taskUsecase.myTask(userName)
   console.log(task,"tasks")
   res.status(HttpStatusCode.OK).json(task)
} catch (error) {
  next(error);
}

  
}
}
