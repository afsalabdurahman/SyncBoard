import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { ISentInvitaion } from "../../repositories/imail/ISentInvitation";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { AuthMapper } from "../../mappers/AuthMapper";
import { ValidationError } from "../../../utils/errors";
import { IinvitationRepository } from "../../../domain/interfaces/repositories/IInvitationRepository";
import { Invitation } from "../../../domain/entities/Invitation";
import mongoose from "mongoose";
import { InvitationStatus } from "../../../types/inviteTypes";

@injectable()
export class SentInvitaionUsecase implements ISentInvitaion {
   constructor(@inject("IEmailService") private _EmailService: IEmailService,
      @inject("InvitaionRepository") private _invitaionRepository: IinvitationRepository,
      @inject("UserRepository") private _userRepository: IUserRepository
   ) { }

   async send(emails: string[], invitaionLink: string, workspaceId: string): Promise<boolean> {
      console.log(emails, invitaionLink, workspaceId, "iddd")
      for (const email of emails) {
         const isValid = AuthMapper.emailValidator(email);
         if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
        
         let inviteEntity = new Invitation({ workspaceId: workspaceId, status: InvitationStatus.PENDING, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), invitedTo: email, })
         await this._invitaionRepository.create(inviteEntity)
          const isSend = await this._EmailService.inviteMembers(email, invitaionLink);
      }



      return true



   }
}