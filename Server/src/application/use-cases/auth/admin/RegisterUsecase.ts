import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { User } from "../../../../domain/entities/User";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { injectable, inject } from "tsyringe";
import { NotFoundError, InternalServerError } from "../../../../utils/errors";
export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: "Member" | "Admin" | "SuperAdmin";
}

@injectable()
export class RegisterUseCase  {
  constructor(
    @inject("AuthService") private authService: IAuthService,
    @inject("UserRepository") private userRepository: IUserRepository
  ) {}

  async execute(
    input: RegisterInput
  ): Promise<{ user: User; token: string } | any> {
    // Manual validation

    const existingUser = await this.userRepository.findByEmail(input.email);
    console.log(existingUser, "exist");
    if (existingUser) throw new NotFoundError("user already have an account");

    const validRoles = ["Member", "Admin", "SuperAdmin"];
    const role =
      input.role && validRoles.includes(input.role) ? input.role : "Admin";

    // Hash password
    const hashedPassword = await this.authService.hashPassword(input.password);

    const user = new User(
      input.email,
      hashedPassword,
      input.name,
      role,
      new Date(),
      new Date(),
      undefined
    );

    // Save user to database

    const savedUser = await this.userRepository.create(user);
    console.log(savedUser, "saved user");
    if (!savedUser) throw new InternalServerError("Failed mongodb");
    const token = this.authService.generateToken({
      id: savedUser._id,
      email: savedUser.email!,
      role: savedUser.role!,
    });
    const refreshToken = this.authService.generateRefreshToken({
      id: savedUser._id!,
      email: savedUser.email!,
      role: savedUser.role!,
    });

    return { user: savedUser, token, refreshToken };
  }
}
