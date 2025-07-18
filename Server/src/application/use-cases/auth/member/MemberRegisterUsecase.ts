import { User } from "../../../../domain/entities/User";
import { IMemberRegister } from "../../../repositories/IMemberRegister";
import {
  NotFoundError,
  CustomError,
  InternalServerError,
} from "../../../../utils/errors";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { injectable, inject } from "tsyringe";
import { HttpStatusCode } from "../../../../common/errorCodes";
import { IWorkspaceRepository } from "../../../../domain/interfaces/repositories/IWorkspaceRepository";
@injectable()
export class MemberRegisterUsecase implements IMemberRegister {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("AuthService") private authService: IAuthService,
    @inject("WorkspaceRepository")
    private workspaceRepository: IWorkspaceRepository
  ) {}

  async execute(
    name: string,
    email: string,
    password: string,
    slug: string,
    title: string,
    role: "Member" | "Admin" | "SuperAdmin"
  ): Promise<User|any> {
    let isFound = await this.userRepository.findByEmail(email);
    if (isFound)
      throw new CustomError("User is exists", HttpStatusCode.CONFLICT);
    let hashedPassword = await this.authService.hashPassword(password);
    if (!hashedPassword)
      throw new CustomError(
        "Something went to wrong ",
        HttpStatusCode.CONFLICT
      );
    //   await this.workspaceRepository.addMemberToWorkspace()
    //create userEntity

    const user = new User(
      email,
      hashedPassword,
      name,
      role,
      new Date(),
      new Date(),
      undefined,
      undefined,
      title
    );

    let createMember = await this.userRepository.create(user);
    if (!createMember) throw new InternalServerError("Member creation Failed");
    console.log(createMember,"member is created++");
    if (!this.workspaceRepository.findbySlug) {
      throw new NotFoundError("not found repo");
    }

    let workspace: any = await this.workspaceRepository.findbySlug(slug);
    if (!workspace) throw new NotFoundError("Workspace not found ");
    console.log(workspace,"workspce created++")
    const addToWorkspace = await this.userRepository.addToWorkspace(
      createMember._id,
      workspace.id,
      role
    );
    console.log(addToWorkspace,"user.push mebrss+++")
    if (!this.workspaceRepository.addMemberToWorkspace)
      throw new NotFoundError("member not found ");
    const insertToWorkspce =await this.workspaceRepository.addMemberToWorkspace(
        slug,
        createMember._id,
        role,
        name,
        email,
        title
      );
      console.log(insertToWorkspce,"worspce.pushmemners++++")
    return {createMember,insertToWorkspce}
  }
}
