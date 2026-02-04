import { Ticket } from "../../domain/entities/Ticket"
import { CountResponseDTO, CountWorkspaceReponseDTO } from "../dto/DatahandleDTO"
<<<<<<< HEAD
import { SuperSubscriptionResponseDTO, UserDetailsResponseDTO, UserResponse } from "../dto/SuperDTO"
export interface IDatahandleUsecase {
fetchDataCounts():Promise<CountResponseDTO|null>
fetchDataworkspace(limit:number,skip:number):Promise<{responseDTO:CountWorkspaceReponseDTO[],totalCount:number}>
fetchAllUsers(limit:number,skip:number):Promise<{responseDTO:UserResponse[],totalCount:number}>
fetchAUser(userId:string):Promise<UserDetailsResponseDTO>
fetchSubscriptions(limit:number,skip:number):Promise<{ responseDTO:SuperSubscriptionResponseDTO [], totalDocCounts: number}>
fetchTickets():Promise<Ticket[]>
=======
import { SuperSubscriptionResponseDTO, UserDetailsResponseDTO, UserResponseDTO } from "../dto/SuperDTO"
export interface IDatahandleUsecase {
    fetchDataCounts(): Promise<CountResponseDTO | null>
    fetchDataworkspace(limit: number, skip: number): Promise<{ responseDTO: CountWorkspaceReponseDTO[], totalCount: number }>
    fetchAllUsers(limit: number, skip: number): Promise<{ responseDTO: UserResponseDTO[], totalCount: number }>
    fetchAUser(userId: string): Promise<UserDetailsResponseDTO>
    fetchSubscriptions(limit: number, skip: number): Promise<{ responseDTO: SuperSubscriptionResponseDTO[], totalDocCounts: number }>
    fetchTickets(): Promise<Ticket[]>
>>>>>>> fix/eslint
}
