import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { ISentInvitaion } from "../../repositories/imail/ISentInvitation";
import { AuthMapper } from "../../mappers/AuthMapper";
import { CustomError, NotFoundError, ValidationError } from "../../../utils/errors";
import { IinvitationRepository } from "../../../domain/interfaces/repositories/IInvitationRepository";
import { Invitation } from "../../../domain/entities/Invitation";
import { InvitationStatus } from "../../../types/inviteTypes";
import { generateRandom5Digit } from "../../../utils/tokenGenerator";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { io } from "../../../server";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
import { ResponseMessages } from "../../../common/erroResponse";


@injectable()
export class SentInvitaionUsecase implements ISentInvitaion {
   constructor(@inject("IEmailService") private _EmailService: IEmailService,
      @inject("UserRepository") private _userRepository: IUserRepository,
      @inject("InvitaionRepository") private _invitaionRepository: IinvitationRepository,
      @inject("WorkspaceRepository")
      private _workspaceRepository: IWorkspaceRepository,
   ) { }

   async send(emails: string[], invitaionLink: string, workspaceId: string): Promise<boolean> {
      console.log(invitaionLink, "link")
      for (const email of emails) {
         const isValid = AuthMapper.emailValidator(email);
         console.log(isValid,"Validtu check")
         const user = await this._userRepository.findByEmail(email);
console.log(user,"Is User")
         if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
         const randomToken = generateRandom5Digit();
         console.log(randomToken,"Token")
         const inviteEntity = new Invitation({ workspaceId: workspaceId, status: InvitationStatus.PENDING, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), invitedTo: email, token: randomToken })
         await this._invitaionRepository.create(inviteEntity)
         if (user) {
           const exists = user.workspace?.some(
  (id) => id.toString() === workspaceId
);
console.log(user,"UserEXIST",exists)
if(exists) throw new CustomError("User already have this workspace",200)
            const slug = invitaionLink.split("/").pop()?.split(" ")[0]
            io.emit(user.email, {
               message: "Do you want join workspace",
               workspaceName: slug,

            })
         } else {


            await this._EmailService.inviteMembers(email, invitaionLink, randomToken);
         }
      }
      return true
   }
   async accpetinvitaion(slug: string, userId: string): Promise<void> {
      console.log("calling usecase", slug, userId)
      if (!this._workspaceRepository.addMemberToWorkspace) throw new NotFoundError("Not found")
      const workspace = await this._workspaceRepository.findbySlug(slug);
      console.log(workspace, "spceee")
      if (!workspace?._id) throw new NotFoundError(ResponseMessages.WORKSPACE_NOT_FOUND)
      await this._workspaceRepository.addMemberToWorkspace(slug, stringToMongoObj(userId), "Member", "Member", "Viewer");
      await this._userRepository.addToWorkspace(stringToMongoObj(userId), stringToMongoObj(workspace?._id.toString()),)
   }
   async rejectInvitation(slug: string, email: string): Promise<void> {
      const workspace = await this._workspaceRepository.findbySlug(slug);
console.log(workspace,"WORKSPCE+++",slug,email)
      if (!workspace?._id) throw new NotFoundError(ResponseMessages.WORKSPACE_NOT_FOUND)
      await this._invitaionRepository.updateStatus(stringToMongoObj(workspace._id.toString()), "cancelled", email)

      io.emit(slug, {
         message: `user rejected to join ${slug} - ${email} 🚫`,

      })
   }
}