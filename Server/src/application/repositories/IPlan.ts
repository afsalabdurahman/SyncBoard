import { SuscriptionRequestDTO } from "../dto/SuscriptionDTOs"
export interface IPlanUsecase{
excute(input:SuscriptionRequestDTO):Promise<string>

}