import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { IDatahandleUsecase } from "../../../application/repositories/IDatahandle";

@injectable()

export class SuperController {
  constructor(@inject("DatahandleUsecase") private _dataHandleUsecase: IDatahandleUsecase) { }
  
  async totalCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseDTO =await this._dataHandleUsecase.fetchDataCounts();
        res.status(200).json({message:"Data fetched",data:responseDTO})
} catch (error) {
next(error)
    }
  }
}
