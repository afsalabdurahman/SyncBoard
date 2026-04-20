import { Request, Response } from "express";
import { IActivity } from "../../../application/repositories/IActivity";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";

@injectable()
export class ActivityController {
  constructor(@inject("ActivityUsecase") private _activityUsecase: IActivity) { }
  async myLogs(req: Request, res: Response): Promise<void> {
    const workspaceId = req.params.id
    const activityResponseDTO = await this._activityUsecase.myLogs(workspaceId)
    res.status(HttpStatusCode.OK).json(activityResponseDTO)

  }
}
