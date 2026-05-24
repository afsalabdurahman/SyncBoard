import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { ISentInvitaion } from "../../repositories/imail/ISentInvitation";
import { AuthMapper } from "../../mappers/AuthMapper";
import { ValidationError } from "../../../utils/errors";
import { IinvitationRepository } from "../../../domain/interfaces/repositories/IInvitationRepository";
import { Invitation } from "../../../domain/entities/Invitation";
import { InvitationStatus } from "../../../types/inviteTypes";
import { generateRandom5Digit } from "../../../utils/tokenGenerator";

@injectable()
export class SentInvitaionUsecase implements ISentInvitaion {
   constructor(@inject("IEmailService") private _EmailService: IEmailService,
      @inject("InvitaionRepository") private _invitaionRepository: IinvitationRepository,

   ) { }

   async send(emails: string[], invitaionLink: string, workspaceId: string): Promise<boolean> {

      for (const email of emails) {
         const isValid = AuthMapper.emailValidator(email);
         if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
         const randomToken = generateRandom5Digit();
         const inviteEntity = new Invitation({ workspaceId: workspaceId, status: InvitationStatus.PENDING, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), invitedTo: email, token: randomToken })
         await this._invitaionRepository.create(inviteEntity)
         await this._EmailService.inviteMembers(email, invitaionLink, randomToken);
      }
      return true
   }
}