import { User } from "../../domain/entities/User";
import { AdminSignupRequestDTO, AdminSignupResponseDTO, LoginRequestDTO, MemeberRegisterRequestDTO } from "../dto/AuthDTOs";
import { Workspace } from "../../domain/entities/Workspace";
import { z ,ZodError} from "zod";
import { SubscriptionAggregateDTO, SubscriptionSummaryDTO } from "../dto/SuperDTO";
export class AuthMapper {
  static mapUserToEntity(dto: AdminSignupRequestDTO): User {
    return new User({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      role: dto.role,
      isAdmin:true,
   
    });
  }
  static mapEntityToUser(entity: User,token:string,refreshToken:string): AdminSignupResponseDTO {
    return {
      user:{
        email: entity.email,
      name: entity.name,
      role:entity.role,
      id:entity._id||""
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
  
  static registerValidation(input:AdminSignupRequestDTO){
    input.role="Admin"
const isValid=z.object({email: z.string().email({ message: "Invalid email format" }),
  password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 letters long" })
    .regex(/^[A-Za-z][A-Za-z\s]*$/, {
      message: "Name must start with a letter and contain only letters and spaces",
    }),
  role: z.literal("Admin"), })
  return isValid.safeParse(input);
  }

static mapSuperEntityToResponse(token:string,refreshToken:string,userCount:number,workspaceCount:number,data:SubscriptionAggregateDTO[]){
  return {
    token,
    refreshToken,
    userCount,
    workspaceCount,
    subscriptionCount:data[0].count,
    subscriptionChanges:data[0].data,
  }
}
static loginValidation(input:LoginRequestDTO){
  const isValid = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
});
return isValid.safeParse(input);

}
static memberRegisterValidation(dto:MemeberRegisterRequestDTO){
  const isValid = z.object({
  name:  z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 letters long" })
    .regex(/^[A-Za-z][A-Za-z\s]*$/, {
      message: "Not a valid name",
    }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  role: z.string({ message: "Role is required" }),
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" }),
  slug: z.string().optional(),
});
return isValid.safeParse(dto)
}

}
