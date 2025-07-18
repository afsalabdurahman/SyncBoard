import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { injectable, inject } from "tsyringe";
import { NotFoundError, ValidationError } from "../../../../utils/errors";
import { ILoginUseCase } from "../../../repositories/admin/ILoginUseCase";
import { User } from "../../../../domain/entities/User";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import {IWorkspaceRepository} from "../../../../domain/interfaces/repositories/IWorkspaceRepository"
@injectable()
export class AdminLoginUseCase implements ILoginUseCase {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("AuthService") private authService: IAuthService,
    @inject("WorkspaceRepository") private workspceRepository:IWorkspaceRepository
  ) {}
  async execute(email: string, password: string): Promise<any | null> {
    let user: User = await this.userRepository.findByEmail(email);
    console.log(user, "user000,");
    if(!user.workspace) throw new NotFoundError("Workspace not found")
    const workspceId:any=user.workspace[0].workspaceId
    if (!user) throw new NotFoundError("Admin not found");
    const isValid = await this.authService.comparePassword(
      password,
      user.password
    );
    if (!isValid) throw new ValidationError("Passwod not match");

   let workspace=await this.workspceRepository.findByObjectId(workspceId)

    return {user,workspace};
  }
}
