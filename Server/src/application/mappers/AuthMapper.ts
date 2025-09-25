import { User } from "../../domain/entities/User";
import { AdminSignupRequestDTO, AdminSignupResponseDTO, MemeberRegisterRequestDTO } from "../dto/AuthDTOs";
import { WorkspaceMembership } from "../../domain/entities/User";
import { Workspace } from "../../domain/entities/Workspace";
export class AuthMapper {
  static mapUserToEntity(dto: AdminSignupRequestDTO): User {
    return new User({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      role: dto.role,
   
    });
  }
  static mapEntityToUser(entity: User,token:string,refreshToken:string): AdminSignupResponseDTO {
    return {
      user:{
        email: entity.email,
      name: entity.name,
      role:entity.role,
      id:entity._id||null
      },
      refreshToken,
      token
    
    };
  }
  static mapMemebrToEntity(dto:MemeberRegisterRequestDTO){
    return new User({
       email:dto.email,
       name:dto.name,
       password:dto.password,
       role:"Member",
       title:dto.title,
     
       
    })
    
    
  }
  static mapEntityToMember(user:User,workspace:Workspace,token:string,refreshToken:string){
   
    return {
      user,
      workspace,
      token,
      refreshToken
    }
  }
}
