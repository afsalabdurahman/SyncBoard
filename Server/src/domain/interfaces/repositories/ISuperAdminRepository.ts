import { GetAllCountResponseDTO, SubscriptionAggResponseDTO, UserAggResponseDTO, UserDetailsAggResponseDTO, WorkspaceAggResponseDTO } from "../../../application/dto/SuperDTO"
import { TicketDocument } from "../../../infrastructure/database/models/TicketModel"

export interface ISuperAdminRepository {
    getAllCount(): Promise<GetAllCountResponseDTO>
    getAllWorkspace(limit:number,skip:number): Promise<WorkspaceAggResponseDTO[]>
    getAllUsers(limit:number,skip:number): Promise<UserAggResponseDTO>
    getUserDetails(userId: string): Promise<UserDetailsAggResponseDTO>
    getSubscription(limit:number,skip:number): Promise<SubscriptionAggResponseDTO>
    getAllTickets():Promise<TicketDocument[]>
}


