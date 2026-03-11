import { inject, injectable } from "tsyringe";
import { CountResponseDTO, CountWorkspaceReponseDTO } from "../../dto/DatahandleDTO";
import { IDatahandleUsecase } from "../../repositories/IDatahandle";
import { ISuperAdminRepository } from "../../../domain/interfaces/repositories/ISuperAdminRepository";
import { DatahandleMapper } from "../../mappers/DatahandleMapper";
import { listOfSubscriptionsDTO, SuperSubscriptionResponseDTO, UserDetailsResponseDTO, UserResponseDTO } from "../../dto/SuperDTO";
import { Ticket } from "../../../domain/entities/Ticket";
import { TicketMapper } from "../../mappers/TicketMapper";
@injectable()

export class DatahandleUsecase implements IDatahandleUsecase {
    constructor(@inject("SuperAdminRepository") private _superAdminRepository: ISuperAdminRepository) { }
    async fetchDataCounts(): Promise<CountResponseDTO | null> {
        const { data, userCount, workspaceCount, abusereportlas } = await this._superAdminRepository.getAllCount();
        if (!data || !userCount || !workspaceCount || !abusereportlas) return null
        const responseDTO = DatahandleMapper.mapSuperEntityToResponse(userCount, workspaceCount, data, abusereportlas)
        return responseDTO as CountResponseDTO
    }

    async fetchDataworkspace(limit: number, skip: number,search:string,filter:string,plan:string): Promise<{ responseDTO: CountWorkspaceReponseDTO[], totalCount: number }> {
        const result = await this._superAdminRepository.getAllWorkspace(limit, skip)
        const { totalCount, responseDTO } = await DatahandleMapper.mapSuperWorkspaceToResponse(result,search,filter,plan)
        return { responseDTO, totalCount }
    }
    async fetchAllUsers(limit: number, skip: number): Promise<{ responseDTO: UserResponseDTO[], totalCount: number }> {
        const response = await this._superAdminRepository.getAllUsers(limit, skip);
     console.log(response,"response")
        const { responseDTO, totalCount } = DatahandleMapper.mapAllUserToResponse(response);
       console.log(responseDTO,totalCount,"count+++")
       
        return { responseDTO, totalCount }
    }
    async fetchAUser(userId: string): Promise<UserDetailsResponseDTO> {
        const result = await this._superAdminRepository.getUserDetails(userId)
        const responseDTO = DatahandleMapper.mapUserDetailsToResponse(result);

        return responseDTO
    }
    async fetchSubscriptions(limit: number, skip: number): Promise<{ responseDTO: SuperSubscriptionResponseDTO[], totalDocCounts: number }> {
        const { subscriptions, totalDocCount } = await this._superAdminRepository.getSubscription(limit, skip)
        console.log(subscriptions[0].history)
        const { responseDTO, totalDocCounts } = DatahandleMapper.mapSubscriptionToResponse(subscriptions, totalDocCount)
       console.log(responseDTO,"resfPoseDTO")
        return { responseDTO, totalDocCounts }
    }
    async fetchTickets(): Promise<Ticket[]> {
        const result = await this._superAdminRepository.getAllTickets()
        const responseDTO = TicketMapper.mapTOTickets(result)
        return responseDTO
    }

}