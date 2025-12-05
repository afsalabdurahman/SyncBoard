import { CountResponseDTO, CountWorkspaceReponseDTO } from "../dto/DatahandleDTO"
import { SuperSubscriptionResponseDTO } from "../dto/SuperDTO"
export interface IDatahandleUsecase {
fetchDataCounts():Promise<CountResponseDTO|null>
fetchDataworkspace():Promise<CountWorkspaceReponseDTO[]>
fetchAllUsers():Promise<any>
fetchAUser(userId:string):Promise<any>
fetchSubscriptions():Promise<SuperSubscriptionResponseDTO[]>
fetchTickets():Promise<any>
}
