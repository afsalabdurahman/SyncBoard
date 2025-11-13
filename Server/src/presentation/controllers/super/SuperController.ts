import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { IDatahandleUsecase } from "../../../application/repositories/IDatahandle";
import { HttpStatusCode } from "../../../common/errorCodes";
import { http } from "winston";
import { ResponseMessages } from "../../../common/erroResponse";

@injectable()

export class SuperController {
  constructor(@inject("DatahandleUsecase") private _dataHandleUsecase: IDatahandleUsecase) { }

  async totalCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseDTO = await this._dataHandleUsecase.fetchDataCounts();
      res.status(200).json({ message: "Data fetched", data: responseDTO })
    } catch (error) {
      next(error)
    }
  }

  async totalWorkspaceCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseDTO = await this._dataHandleUsecase.fetchDataworkspace();
      res.status(HttpStatusCode.OK).json({ responseDTO })
    } catch (error) {
      next(error)
    }
  }
  async totalUsersCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseDTO = await this._dataHandleUsecase.fetchAllUsers();
      res.status(HttpStatusCode.OK).json({ message: ResponseMessages.SUCCESS, data: responseDTO })
    } catch (error) {
      next(error)
    }
  }
  async fetchAUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.params.id
      const responseDTO = await this._dataHandleUsecase.fetchAUser(userId);
      res.status(HttpStatusCode.OK).json({ message: ResponseMessages.Fetch_SUCCESS, data: responseDTO })
    } catch (error) {
      console.log(error)
    }
  }
  async fetchSubscription(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
      const responseDTO=await this._dataHandleUsecase.fetchSubscriptions()
      res.status(HttpStatusCode.OK).json({message:"Data feched",data:responseDTO})
    } catch (error) {
      console.log(error)
    }
  }

}
