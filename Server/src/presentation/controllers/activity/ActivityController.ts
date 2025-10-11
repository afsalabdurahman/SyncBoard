import { Request, Response, NextFunction } from "express";
import { IActivity } from "../../../application/repositories/IActivity";
import { inject, injectable } from "tsyringe";

@injectable()
export class ActivityController {
  constructor(@inject("ActivityUsecase") private _activityUsecase: IActivity) {}

  async createActivity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
 
    let workspaceId = req.body.id;
    let workspaceName = req.body.name;
    let createdBy = req.body.created;
    await this._activityUsecase.execute(workspaceId, workspaceName, createdBy);
  }
  async allActivity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const workspaceId: any = req.query.workspaceId;
    const { workspaceLogs, projectActivtyLogs,userActivityLogs }: any =
      await this._activityUsecase.getAllActivities(workspaceId);

    res.json({ workspaceLogs, projectActivtyLogs,userActivityLogs });
  }
}
