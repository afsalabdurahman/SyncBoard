import { inject, injectable } from "tsyringe";
import { CountResponseDTO, CountWorkspaceReponseDTO } from "../../dto/DatahandleDTO";
import { IDatahandleUsecase } from "../../repositories/IDatahandle";
import { ISuperAdminRepository } from "../../../domain/interfaces/repositories/ISuperAdminRepository";
import { DatahandleMapper } from "../../mappers/DatahandleMapper";
import { SuperSubscriptionResponseDTO, UserDetailsResponseDTO, UserResponse } from "../../dto/SuperDTO";
import { Ticket } from "../../../domain/entities/Ticket";
@injectable()

export class DatahandleUsecase implements IDatahandleUsecase {
    constructor(@inject("SuperAdminRepository") private _superAdminRepository: ISuperAdminRepository) { }
    async fetchDataCounts(): Promise<CountResponseDTO | null> {
        const { data, userCount, workspaceCount,abusereportlas } = await this._superAdminRepository.getAllCount();
       
        const responseDTO = DatahandleMapper.mapSuperEntityToResponse(userCount, workspaceCount, data,abusereportlas)
        return responseDTO as CountResponseDTO
    }

    async fetchDataworkspace(limit:number,skip:number): Promise<{responseDTO:CountWorkspaceReponseDTO[],totalCount:number}> {
        const result = await this._superAdminRepository.getAllWorkspace(limit,skip)
        console.log(result,"rest")
        const {totalCount,responseDTO} = DatahandleMapper.mapSuperWorkspaceToResponse(result)
        return {responseDTO,totalCount}
    }
    async fetchAllUsers(limit:number,skip:number): Promise<{responseDTO:UserResponse[],totalCount:number}> {
        const response = await this._superAdminRepository.getAllUsers(limit,skip);
        const {responseDTO,totalCount} = DatahandleMapper.mapAllUserToResponse(response);
        return {responseDTO,totalCount}
    }
    async fetchAUser(userId: string): Promise<UserDetailsResponseDTO> {
        const result=await this._superAdminRepository.getUserDetails(userId)
        const responseDTO = DatahandleMapper.mapUserDetailsToResponse(result)
        return responseDTO
    }
    async fetchSubscriptions(limit:number,skip:number): Promise<{responseDTO:SuperSubscriptionResponseDTO[],totalCount:number}> {
        const result=await this._superAdminRepository.getSubscription(limit,skip)
       const {totalCount,responseDTO} = DatahandleMapper.mapSubscriptionToResponse(result)
        return {responseDTO,totalCount}
    }
    async fetchTickets(): Promise<Ticket[]> {
        const  result = await this._superAdminRepository.getAllTickets()
        console.log(result,"results")
        return result
    }

}