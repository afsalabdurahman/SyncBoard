import { container } from "tsyringe";
// import { DatabaseConfig } from '../DatabaseConfig';
import { UserMongooseRepository } from "../../repositories/UserRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { AuthService } from "../../services/AuthService";
import { IAuthService } from "../../../domain/interfaces/services/IAuthService";
import { RegisterUseCase } from "../../../application/use-cases/auth/admin/RegisterUsecase";
// import { EmailService } from '../services/email.service.impl';
// import { IEmailService } from '../../domain/interfaces/services/email.service';
import { ILogger } from "../../../application/repositories/ilogger/ILogger";
import { WinstonLoggerImpl } from "../../logger/WinstonLoggerImpl";
import { NodemailerService } from "../../services/NodeMailerService";
import { SentInvitaionUsecase } from "../../../application/use-cases/invitation/SentInvitaion";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { EmailConfig } from "../EmailConfig";
import { OTPRepository } from "../../../infrastructure/repositories/OTPRepository";
import { OTPService } from "../../../application/use-cases/otp/SentOtpUsecases";
import { OTPController } from "../../../presentation/controllers/otp/OTPController";
import { CreateWorkspaceUsecases } from "../../../application/use-cases/workspace/CreateWorkspaceUsecase";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
//import {LogRepository} from "../../repositories/LogRepository"
import { WorkspaceRepository } from "../../repositories/WorkspaceRepository";
import { ChangePasswordUsecase } from "../../../application/use-cases/auth/member/ChangePasswordUsecase";
import { LoginUsecase } from "../../../application/use-cases/auth/member/LoginUsecase";
import { UpdateUserProfileUsecase } from "../../../application/use-cases/profiles/UpdateUserProfile";
// Register dependencies
import { AbuseRepository } from "../../repositories/AbuseRepository";
import { ISentInvitaion } from "../../../application/repositories/imail/ISentInvitation";
import { RefreshTokenUsecase } from "../../../application/use-cases/auth/shared/RefreshTokenUsecase";
import { AdminLoginUseCase } from "../../../application/use-cases/auth/admin/LoginUsecase";
import { GetWorkspaceUsecase } from "../../../application/use-cases/workspace/GetWorkspaceUsecase";
import { MemberRegisterUsecase } from "../../../application/use-cases/auth/member/MemberRegisterUsecase";
import { ProjectUsecase } from "../../../application/use-cases/project/ProjectUsecase";
import { ProjectRepository } from "../../repositories/ProjectRepository";
import { TaskRepository } from "../../repositories/TaskRepository";
import { TaskUsecase } from "../../../application/use-cases/task/TaskUsecase";
import { ChatUsecase } from "../../../application/use-cases/chat/ChatUsecase";
import { ChatRepository } from "../../repositories/ChatRepository";
import { ActivityUsecase } from "../../../application/use-cases/activity/ActivityUsecase";
import { ActivityRepository } from "../../repositories/ActivityRepository";
import { SuscriptionRepository } from "../../repositories/SuscriptionRepository"
import { SubscriptionUsecase } from "../../../application/use-cases/suscription/SuscriptionUsecase"
import { PlanUsecase } from "../../../application/use-cases/suscription/plans/PlanUsecase"
import { StripeService } from "../../services/StripeService"
import { PlanRepository } from "../../repositories/PlanRepository";
import { SuperAdminRepository } from "../../repositories/SuperAdminRepository";
import { InvitaionRepository } from "../../repositories/InvitationRepository";
import { DatahandleUsecase } from "../../../application/use-cases/super/DatahandleUsecase";
//import { LogUseCases } from "../../../application/use-cases/activity/LogUsecases";
// container.register("LogRepository",{useClass:LogRepository})
// container.register("LogUsecases",{useClass:LogUseCases})
import { RagOrchestrator } from "../../orchestrator/RagOrchestrator";
// import {XenovaEmbeddingProvider} from "../../services/ragPipeline/EmbbedPipeline";
import { GetUserUseCase } from "../../../application/use-cases/user/GetUserUsecase";
import { MongoVectorStore } from "../../services/ragPipeline/VectorSerach";
import { GroqLLMProvider } from "../../services/ragPipeline/LLMrapper";
import { RagUseCase } from "../../../application/use-cases/rag/RagUsecase"
import { AbuseUsecase } from "../../../application/use-cases/workspace/AbuseUsecase";
import { TicketRepository } from "../../repositories/TicketRepository";
import { TicketUsecase } from "../../../application/use-cases/ticket/TicketUsecase";
import { ResendMailService } from "../../services/ResendMailService";
container.register("TicketUsecase", { useClass: TicketUsecase })
container.register("GetUserUsecase",{useClass:GetUserUseCase})
container.register("TicketRepository", { useClass: TicketRepository })
container.register("InvitaionRepository",{useClass:InvitaionRepository})
container.register("AbuseRepository", { useClass: AbuseRepository })
container.register("AbuseUsecase", { useClass: AbuseUsecase })
container.register("RagUsecase", { useClass: RagUseCase })
container.register("MongoVectorStore", { useClass: MongoVectorStore })
container.register("GroqLLMProvider", { useClass: GroqLLMProvider })
// container.register("XenovaEmbeddingProvider",{useClass:XenovaEmbeddingProvider}) 
container.register("RagOrchestrator", { useClass: RagOrchestrator })
container.register("SuperAdminRepository", { useClass: SuperAdminRepository })
container.register("DatahandleUsecase", { useClass: DatahandleUsecase })
container.registerSingleton<ILogger>('ILogger', WinstonLoggerImpl);
container.register("SuscriptionRepository", { useClass: SuscriptionRepository })
container.register("IStripeServices", { useClass: StripeService })
container.register("PlanRepository", { useClass: PlanRepository })
container.register("ActivityRepository", { useClass: ActivityRepository });
container.register("ActivityUsecase", { useClass: ActivityUsecase });
container.register("SuscriptionUsecase", { useClass: SubscriptionUsecase })
container.register("PlanUsecase", { useClass: PlanUsecase })
container.register("ChatUseCase", { useClass: ChatUsecase });
container.register("ChatRepository", { useClass: ChatRepository });
container.register("TaskUsecase", { useClass: TaskUsecase });
container.register("TaskRepository", { useClass: TaskRepository });
container.register("ProjectUsecase", { useClass: ProjectUsecase });
container.register("ProjectRepository", { useClass: ProjectRepository });
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
container.register("IResendMailService", { useClass: ResendMailService });
container.register("OTPRepository", { useClass: OTPRepository });
container.register("OTPService", { useClass: OTPService });

container.register(OTPController, { useClass: OTPController });
// container.registerSingleton<DatabaseConfig>('DatabaseConfig', DatabaseConfig);
container.registerSingleton<IWorkspaceRepository>(
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
