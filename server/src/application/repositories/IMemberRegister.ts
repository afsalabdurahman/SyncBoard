
import { MemberRegisterResposeDTO, MemeberRegisterRequestDTO,  } from "../dto/AuthDTOs";
export interface IMemberRegister {
    execute (dto:MemeberRegisterRequestDTO) :Promise<MemberRegisterResposeDTO>
}