import { inject, injectable } from "tsyringe";
import { CountResponseDTO, CountWorkspaceReponseDTO } from "../../dto/DatahandleDTO";
import { IDatahandleUsecase } from "../../repositories/IDatahandle";

import { ISuperAdminRepository } from "../../../domain/interfaces/repositories/ISuperAdminRepository";
import { DatahandleMapper } from "../../mappers/DatahandleMapper";
@injectable()

export class DatahandleUsecase implements IDatahandleUsecase {
    constructor(@inject("SuperAdminRepository") private _superAdminRepository: ISuperAdminRepository) { }
    async fetchDataCounts(): Promise<CountResponseDTO | null> {
        const { data, userCount, workspaceCount } = await this._superAdminRepository.getAllCount();

        const responseDTO = DatahandleMapper.mapSuperEntityToResponse(userCount, workspaceCount, data)
        return responseDTO as CountResponseDTO
    }

    async fetchDataworkspace(): Promise<CountWorkspaceReponseDTO[]> {
        const result = await this._superAdminRepository.getAllWorkspace()
        const responseDTO = DatahandleMapper.mapSuperWorkspaceToResponse(result)
        return responseDTO
    }
    async fetchAllUsers(): Promise<any> {
        const response = await this._superAdminRepository.getAllUsers();
        const responseDTO = DatahandleMapper.mapAllUserToResponse(response);
        return responseDTO
    }
    async fetchAUser(userId: string): Promise<any> {
        const result=await this._superAdminRepository.getUserDetails(userId)
        const responseDTO = DatahandleMapper.mapUserDetailsToResponse(result)
        return responseDTO
    }
    async fetchSubscriptions(): Promise<any> {
        const result=await this._superAdminRepository.getSubscription()
       const responseDTO = DatahandleMapper.mapSubscriptionToResponse(result)
        return responseDTO
    }
    async fetchTickets(): Promise<any> {
        const  result = await this._superAdminRepository.getAllTickets()
        return result
    }

}