import { Request, Response, NextFunction } from "express";
import { IActivity } from "../../../application/repositories/IActivity";
import { inject, injectable } from "tsyringe";

@injectable()
export class ActivityController {
  constructor(@inject("ActivityUsecase") private activityUsecase: IActivity) {}

  async createActivity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log(req.body, "body data");
    let workspaceId = req.body.id;
    let workspaceName = req.body.name;
    let createdBy = req.body.created;
    await this.activityUsecase.execute(workspaceId, workspaceName, createdBy);
  }
  async allActivity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const workspaceId: any = req.query.workspaceId;
    const { workspaceLogs, projectActivtyLogs,userActivityLogs }: any =
      await this.activityUsecase.getAllActivities(workspaceId);
    console.log(workspaceLogs, projectActivtyLogs, "@Actvity Controler");
    res.json({ workspaceLogs, projectActivtyLogs,userActivityLogs });
  }
}
