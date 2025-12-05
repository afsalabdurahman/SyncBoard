import { Request, Response, NextFunction } from "express";
import { IActivity } from "../../../application/repositories/IActivity";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";

@injectable()
export class ActivityController {
  constructor(@inject("ActivityUsecase") private _activityUsecase: IActivity) {}

  // async createActivity(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
 
  //   let workspaceId = req.body.id;
  //   let workspaceName = req.body.name;
  //   let createdBy = req.body.created;
  //   await this._activityUsecase.execute(workspaceId, workspaceName, createdBy);
  // }
  // async allActivity(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const workspaceId: any = req.query.workspaceId;
  //   const { workspaceLogs, projectActivtyLogs,userActivityLogs }: any =
  //     await this._activityUsecase.getAllActivities(workspaceId);

  //   res.json({ workspaceLogs, projectActivtyLogs,userActivityLogs });
  // }
//   async findCount(req:Request,res:Response,next:NextFunction):Promise<void>{
//     console.log("calling...")
//     const userId = req.params.id
//     console.log(userId)
// await this._activityUsecase.findCountofWorkspace(userId)
//   }
async myLogs(req:Request,res:Response,next:NextFunction):Promise<void>{
  try {
    const workspaceId=req.params.id
    const activityResponseDTO = await this._activityUsecase.myLogs(workspaceId)
    res.status(HttpStatusCode.OK).json(activityResponseDTO)  
  } catch (error) {
    console.log(error,"errr")
  }
}
}
