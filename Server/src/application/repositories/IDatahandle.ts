import { CountResponseDTO, CountWorkspaceReponseDTO } from "../dto/DatahandleDTO"
export interface IDatahandleUsecase {
fetchDataCounts():Promise<CountResponseDTO|null>
fetchDataworkspace():Promise<CountWorkspaceReponseDTO[]>
fetchAllUsers():Promise<any>
fetchAUser(userId:string):Promise<any>
fetchSubscriptions():Promise<any>
fetchTickets():Promise<any>
}
