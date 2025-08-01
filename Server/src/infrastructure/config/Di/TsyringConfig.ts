import { container } from "tsyringe";
// import { DatabaseConfig } from '../DatabaseConfig';
import { UserMongooseRepository } from "../../repositories/UserRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { AuthService } from "../../services/AuthService";
import { IAuthService } from "../../../domain/interfaces/services/IAuthService";
import { RegisterUseCase } from "../../../application/use-cases/auth/admin/RegisterUsecase";
// import { EmailService } from '../services/email.service.impl';
// import { IEmailService } from '../../domain/interfaces/services/email.service';
import { User } from "../../../domain/entities/User";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { NodemailerService } from "../../services/NodeMailerService";
import { SentInvitaionUsecase } from "../../../application/use-cases/invitation/SentInvitaion";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { EmailConfig } from "../EmailConfig";
import { OTPRepository } from "../../../infrastructure/repositories/OTPRepository";
import { OTPService } from "../../../application/use-cases/otp/SentOtpUsecases";
import { OTPController } from "../../../presentation/controllers/otp/OTPController";
import { CreateWorkspaceUsecases } from "../../../application/use-cases/workspace/CreateWorkspaceUsecase";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { WorkspaceModel } from "../../database/models/WorkspaceModel";
import { WorkspaceRepository } from "../../repositories/WorkspaceRepository";
import { ChangePasswordUsecase } from "../../../application/use-cases/auth/member/ChangePasswordUsecase";
import { LoginUsecase } from "../../../application/use-cases/auth/member/LoginUsecase";
import { AuthController } from "../../../presentation/controllers/auth/UserAuthController";
import { UpdateUserProfileUsecase } from "../../../application/use-cases/profiles/UpdateUserProfile";
// Register dependencies
import {ISentInvitaion} from "../../../application/repositories/imail/ISentInvitation"
import { RefreshTokenUsecase } from "../../../application/use-cases/auth/shared/RefreshTokenUsecase";
import { AdminLoginUseCase } from "../../../application/use-cases/auth/admin/LoginUsecase";
import { GetWorkspaceUsecase } from "../../../application/use-cases/workspace/GetWorkspaceUsecase";
import { MemberRegisterUsecase } from "../../../application/use-cases/auth/member/MemberRegisterUsecase";
import {ProjectUsecase} from"../../../application/use-cases/project/ProjectUsecase"
import {ProjectRepository} from"../../repositories/ProjectRepository"
import {TaskRepository} from "../../repositories/TaskRepository"
import {TaskUsecase} from "../../../application/use-cases/task/TaskUsecase"
import { ChatUsecase } from "../../../application/use-cases/chat/ChatUsecase";
import { ChatRepository } from "../../repositories/ChatRepository";
container.register("ChatUseCase",{useClass:ChatUsecase})
container.register("ChatRepository",{useClass:ChatRepository})
container.register("TaskUsecase",{useClass:TaskUsecase})
container.register("TaskRepository",{useClass:TaskRepository})
container.register("ProjectUsecase",{useClass:ProjectUsecase})
container.register("ProjectRepository",{useClass:ProjectRepository})
container.register("MemberRegisterUsecase", {
  useClass: MemberRegisterUsecase,
});
container.register("IWokspaceMember", { useClass: GetWorkspaceUsecase });
container.register("UpdateProfileUsecase", {
  useClass: UpdateUserProfileUsecase,
});
container.register("RefreshToken", { useClass: RefreshTokenUsecase });
container.register("ILoginUsesCase", { useClass: AdminLoginUseCase });
container.register("ChangePasswordUsecase", {
  useClass: ChangePasswordUsecase,
});
container.register("authservice", { useClass: AuthService });
container.register("LoginUseCase", { useClass: LoginUsecase });
container.register("IUserRepository", { useClass: UserMongooseRepository });
container.register<IOtpRepository>("IOTPrepository", {
  useClass: OTPRepository,
});

container.register("WorkspaceuseCases", { useClass: CreateWorkspaceUsecases });
container.register("Workspaceuse", { useClass: CreateWorkspaceUsecases });

container.register(EmailConfig, { useClass: EmailConfig });
container.register("IEmailService", { useClass: NodemailerService });
container.register("OTPRepository", { useClass: OTPRepository });
container.register(OTPService, { useClass: OTPService });

container.register(OTPController, { useClass: OTPController });
// container.registerSingleton<DatabaseConfig>('DatabaseConfig', DatabaseConfig);
container.registerSingleton<IWorkspaceRepository | any>(
  "WorkspaceRepository",
  WorkspaceRepository
);

container.registerSingleton<IUserRepository>(
  "UserRepository",
  UserMongooseRepository
);
container.registerSingleton<IAuthService>("AuthService", AuthService);
container.registerSingleton<RegisterUseCase>(
  "RegisterUseCase",
  RegisterUseCase
);
container.register<ISentInvitaion>("SentInvitaion", {
  useClass: SentInvitaionUsecase,
});
// container.registerSingleton<IEmailService>('EmailService', EmailService);

export { container };
