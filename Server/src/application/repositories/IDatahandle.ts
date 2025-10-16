import { AdminSignupResponseDTO ,AdminSignupRequestDTO,SuperadminResponseDTO } from "../dto/AuthDTOs"
import { CountResponseDTO } from "../dto/DatahandleDTO"
export interface IDatahandleUsecase {
fetchDataCounts():Promise<CountResponseDTO|null>
}
