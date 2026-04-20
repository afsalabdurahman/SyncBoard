import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IDatahandleUsecase } from "../../../application/repositories/IDatahandle";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";

@injectable()

export class SuperController {
  constructor(@inject("DatahandleUsecase") private _dataHandleUsecase: IDatahandleUsecase) { }

  async totalCount(req: Request, res: Response, ): Promise<void> {
    
      const responseDTO = await this._dataHandleUsecase.fetchDataCounts();
      res.status(200).json({ message: "Data fetched", data: responseDTO })
  
  }

  async totalWorkspaceCount(req: Request, res: Response, ): Promise<void> {
    
        const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
   const query = req.query.search as string;
   const filter = req.query.filter as string;
   const plan = req.query.plan as string
      const {responseDTO,totalCount} = await this._dataHandleUsecase.fetchDataworkspace(limit,skip,query,filter,plan);
     
      res.status(HttpStatusCode.OK).json({ responseDTO, currentPage: page, totalPages: Math.ceil(totalCount / limit),totalCount })
   
  }
  async totalUsersCount(req: Request, res: Response, ): Promise<void> {
    
              const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
       const {responseDTO,totalCount}  = await this._dataHandleUsecase.fetchAllUsers(limit,skip);
     console.log(responseDTO,"responseDETO OF USERS",totalCount,"COUNTTOTAL")
       res.status(HttpStatusCode.OK).json({ message: ResponseMessages.SUCCESS, data: responseDTO,currentPage: page, totalPages: Math.ceil(totalCount / limit),totalCount })
   
  }
  async fetchAUser(req: Request, res: Response, ): Promise<void> {
   
      const userId = req.params.id as string
      const responseDTO = await this._dataHandleUsecase.fetchAUser(userId);
      res.status(HttpStatusCode.OK).json({ message: ResponseMessages.FETCH_SUCCESS, data: responseDTO })
  
  }
  async fetchSubscription(req:Request,res:Response,):Promise<void>{
    
         const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
      const {responseDTO,totalDocCounts}=await this._dataHandleUsecase.fetchSubscriptions(limit,skip)

      res.status(HttpStatusCode.OK).json({message:"Data feched",data:responseDTO,currentPage: page, totalPages: Math.ceil(totalDocCounts / limit),totalDocCounts })
   
  }
async fetchTickets(req:Request,res:Response,):Promise<void>{
 
    const tickets=await this._dataHandleUsecase.fetchTickets();
  
res.status(HttpStatusCode.OK).json(tickets)
 
}

async fetchAllPlans(req:Request,res:Response,):Promise<void>{
  
   const plan = await this._dataHandleUsecase.fetchPlans();

   res.status(HttpStatusCode.OK).json(plan)
 
}
async createNewPlan(req:Request,res:Response,):Promise<void>{
 

    await this._dataHandleUsecase.createPlan(req.body.form);
    res.status(HttpStatusCode.CREATED).json({message:ResponseMessages.CREATED})
 
}

async updatePlan(req:Request,res:Response,):Promise<void>{
  
   
    const id  = req.params.id as string
    await this._dataHandleUsecase.updatePlan(req.body.form,id);
    res.status(HttpStatusCode.CREATED).json({message:ResponseMessages.CREATED})
 
}
async removePlan(req:Request,res:Response,):Promise<void>{
 
    const id = req.params.id as string

    await this._dataHandleUsecase.removePlan(id);
    res.status(HttpStatusCode.OK).json({message:ResponseMessages.SUCCESS})
 
}
async deletePlan(req:Request,res:Response,):Promise<void>{
  
    const id = req.params.id as string

    await this._dataHandleUsecase.deletePlan(id);
    res.status(HttpStatusCode.OK).json({message:ResponseMessages.SUCCESS})
  
}
async revenuSubscription(req:Request,res:Response):Promise<void>{
const revenue=await this._dataHandleUsecase.fetchSubscriptionRevenue();
res.status(HttpStatusCode.OK).json(revenue)
}

async UserGrowthChart(req:Request,res:Response):Promise<void>{
  const usergrowthChartData= await this._dataHandleUsecase.fetchUserGrowth();
  res.status(HttpStatusCode.OK).json(usergrowthChartData)
}
}
