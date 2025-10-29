import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { User } from "../../../../domain/entities/User";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { injectable, inject } from "tsyringe";
import { NotFoundError, InternalServerError, ValidationError } from "../../../../utils/errors";
import { IAuth } from "../../../repositories/iauth/IAuth";
import { AdminSignupRequestDTO, AdminSignupResponseDTO } from "../../../dto/AuthDTOs";
import { AuthMapper } from "../../../mappers/AuthMapper";
export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: "Member" | "Admin" | "SuperAdmin";
}

@injectable()
export class RegisterUseCase implements IAuth {
  constructor(
    @inject("AuthService") private _authService: IAuthService,
    @inject("UserRepository") private _userRepository: IUserRepository
  ) { }

  async execute(
    input: AdminSignupRequestDTO
  ): Promise<AdminSignupResponseDTO> {
   
    const isValid = AuthMapper.registerValidation(input);
   
    if (!isValid.success) throw new ValidationError("Validation failed");
    const existingUser = await this._userRepository.findByEmail(input.email);
    if (existingUser) throw new NotFoundError("user already have an account");
    const validRoles = ["Member", "Admin", "SuperAdmin"];
    const role = input.role && validRoles.includes(input.role) ? input.role : "Admin";

    // Hash password
    const hashedPassword = await this._authService.hashPassword(input.password);
    input.password = hashedPassword;
    const newAdmin = AuthMapper.mapUserToEntity(input)

    // Save user to database

    const savedUser = await this._userRepository.create(newAdmin);
   
    if (!savedUser) throw new InternalServerError("Failed mongodb");
    const token = this._authService.generateToken({
      id: savedUser._id ?? "",
      email: savedUser.email!,
      role: savedUser.role!,
    });
    const refreshToken = this._authService.generateRefreshToken({
      id: savedUser._id!,
      email: savedUser.email!,
      role: savedUser.role!,
    });
    return AuthMapper.mapEntityToUser(savedUser, token, refreshToken)

  }
}
