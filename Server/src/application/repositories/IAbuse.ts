import { AbuseRequestDTO } from "../dto/AbuseDTO";

export interface IAbuseUsecase{
    execute(input:AbuseRequestDTO,userId:string):Promise<string>
}