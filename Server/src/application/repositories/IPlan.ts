import { Plan } from "../../domain/entities/Plan"
import { SuscriptionRequestDTO } from "../dto/SuscriptionDTOs"
export interface IPlanUsecase{
excute(input:SuscriptionRequestDTO):Promise<string>

}