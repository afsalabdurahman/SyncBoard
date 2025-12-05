import { GetAllCountResponseDTO, SubscriptionAggResponseDTO, UserAggResponseDTO, UserDetailsAggResponseDTO, WorkspaceAggResponseDTO } from "../../../application/dto/SuperDTO"

export interface ISuperAdminRepository {
    getAllCount(): Promise<GetAllCountResponseDTO>
    getAllWorkspace(): Promise<WorkspaceAggResponseDTO[]>
    getAllUsers(): Promise<UserAggResponseDTO[]>
    getUserDetails(userId: string): Promise<UserDetailsAggResponseDTO>
    getSubscription(): Promise<SubscriptionAggResponseDTO[]>
    getAllTickets():Promise<any>
}


