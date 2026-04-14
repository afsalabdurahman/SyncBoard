import { Plan } from "../../domain/entities/Plan"
import { Ticket } from "../../domain/entities/Ticket"
import { CountResponseDTO, CountWorkspaceReponseDTO } from "../dto/DatahandleDTO"
import { PlanRequestDTO } from "../dto/PlanDTO"
import { RevenuChartReponseDTO, SuperSubscriptionResponseDTO, UserDetailsResponseDTO, UserGrowthChartReponseDTO, UserResponseDTO } from "../dto/SuperDTO"
export interface IDatahandleUsecase {
    fetchDataCounts(): Promise<CountResponseDTO | null>
    fetchDataworkspace(limit: number, skip: number,search:string,filter:string,plan:string): Promise<{ responseDTO: CountWorkspaceReponseDTO[], totalCount: number }>
    fetchAllUsers(limit: number, skip: number): Promise<{ responseDTO: UserResponseDTO[], totalCount: number }>
    fetchAUser(userId: string): Promise<UserDetailsResponseDTO>
    fetchSubscriptions(limit: number, skip: number): Promise<{ responseDTO: SuperSubscriptionResponseDTO[]|[], totalDocCounts: number }>
    fetchTickets(): Promise<Ticket[]>;
    fetchPlans():Promise<Plan[]>;
    createPlan(input:PlanRequestDTO):Promise<void>;
    updatePlan(input:PlanRequestDTO,id:string):Promise<void>;
    removePlan(id:string):Promise<void>;
    deletePlan(id:string):Promise<void>;
    fetchSubscriptionRevenue():Promise<RevenuChartReponseDTO[]|null>
    fetchUserGrowth():Promise<UserGrowthChartReponseDTO[]|null>
}
