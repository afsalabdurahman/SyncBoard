import { Types } from "mongoose"
import { PlanRequestDTO } from "../../../application/dto/PlanDTO"
import { GetAllCountResponseDTO, RevenuChartReponseDTO, SubscriptionAggResponseDTO, SuperUserResponseDto, UserAggResponseDTO, UserGrowthChartReponseDTO, WorkspaceAggResponseDTO } from "../../../application/dto/SuperDTO"
import { PlanDocument } from "../../../infrastructure/database/models/PlanModel"
import { TicketDocument } from "../../../infrastructure/database/models/TicketModel"

export interface ISuperAdminRepository {
    getAllCount(): Promise<GetAllCountResponseDTO>
    getAllWorkspace(limit:number,skip:number): Promise<WorkspaceAggResponseDTO[]>
    getAllUsers(limit:number,skip:number): Promise<UserAggResponseDTO>
    getUserDetails(userId: string): Promise<SuperUserResponseDto>
    getSubscription(limit:number,skip:number): Promise<SubscriptionAggResponseDTO>
    getAllTickets():Promise<TicketDocument[]>;
    getAllPlans():Promise<PlanDocument[]>;
    createPlan(input:PlanRequestDTO):Promise<void>;
    updatePlan(input:PlanRequestDTO,id:Types.ObjectId):Promise<void>;
    getRevenueChart():Promise<RevenuChartReponseDTO[]|null>;
    getUserGrowth():Promise<UserGrowthChartReponseDTO[]|null>
}


