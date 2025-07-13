import { injectable,inject } from "tsyringe";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import {Workspace} from "../../../domain/entities/Workspace"
import { HttpStatusCode } from "../../../common/errorCodes";
import {} from"../../../utils/errors"
import {} from"../../../common/erroResponse"

@injectable()
export class CreateWorkspaceUsecases{
    constructor(@inject("WorkspaceRepository") private workspaceRepository:IWorkspaceRepository ){}

    async createWorksapce(workspaceData:any):Promise<Workspace|any>{
 try {
   
    let isCreate =await this.workspaceRepository.create(workspaceData)
    return isCreate
 } catch (error) {
   console.log(error,"from useses")
  throw error
 }
        
}
}