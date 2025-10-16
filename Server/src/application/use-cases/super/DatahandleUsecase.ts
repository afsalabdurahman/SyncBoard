import { inject, injectable } from "tsyringe";
import { CountResponseDTO } from "../../dto/DatahandleDTO";
import { IDatahandleUsecase } from "../../repositories/IDatahandle";

import { ISuperAdminRepository } from "../../../domain/interfaces/repositories/ISuperAdminRepository";
import { DatahandleMapper } from "../../mappers/DatahandleMapper";
@injectable()

export class DatahandleUsecase implements IDatahandleUsecase {
    constructor( @inject("SuperAdminRepository") private _superAdminRepository:ISuperAdminRepository){}
   async fetchDataCounts():Promise<CountResponseDTO|null> {
         const {data,userCount,workspaceCount}= await this._superAdminRepository.getAllCount();
         const responseDTO=DatahandleMapper.mapSuperEntityToResponse(userCount,workspaceCount,data)
         return responseDTO as CountResponseDTO
    }



}