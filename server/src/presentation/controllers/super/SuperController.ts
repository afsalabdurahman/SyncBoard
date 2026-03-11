import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { IDatahandleUsecase } from "../../../application/repositories/IDatahandle";
import { HttpStatusCode } from "../../../common/errorCodes";
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
        const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
   const query = req.query.search as string;
   const filter = req.query.filter as string;
   const plan = req.query.plan as string
      const {responseDTO,totalCount} = await this._dataHandleUsecase.fetchDataworkspace(limit,skip,query,filter,plan);
     
      res.status(HttpStatusCode.OK).json({ responseDTO, currentPage: page, totalPages: Math.ceil(totalCount / limit),totalCount })
    } catch (error) {
      next(error)
    }
  }
  async totalUsersCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
              const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
       const {responseDTO,totalCount}  = await this._dataHandleUsecase.fetchAllUsers(limit,skip);
     
       res.status(HttpStatusCode.OK).json({ message: ResponseMessages.SUCCESS, data: responseDTO,currentPage: page, totalPages: Math.ceil(totalCount / limit),totalCount })
    } catch (error) {
      next(error)
    }
  }
  async fetchAUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id
      const responseDTO = await this._dataHandleUsecase.fetchAUser(userId);
      res.status(HttpStatusCode.OK).json({ message: ResponseMessages.Fetch_SUCCESS, data: responseDTO })
    } catch (error) {
next(error)
    }
  }
  async fetchSubscription(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
         const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
      const {responseDTO,totalDocCounts}=await this._dataHandleUsecase.fetchSubscriptions(limit,skip)

      res.status(HttpStatusCode.OK).json({message:"Data feched",data:responseDTO,currentPage: page, totalPages: Math.ceil(totalDocCounts / limit),totalDocCounts })
    } catch (error) {
      next(error)
    }
  }
async fetchTickets(req:Request,res:Response,next:NextFunction):Promise<void>{
  try {
    const tickets=await this._dataHandleUsecase.fetchTickets();
  
res.status(HttpStatusCode.OK).json(tickets)
  } catch (error) {
   
    next(error)
  }
}
}
