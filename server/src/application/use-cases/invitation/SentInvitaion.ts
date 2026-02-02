import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { ISentInvitaion } from "../../repositories/imail/ISentInvitation";

@injectable()
export class SentInvitaionUsecase implements ISentInvitaion {
  constructor(@inject("IEmailService") private _EmailService: IEmailService) {}

   async send(emails: string[], invitaionLink: string): Promise<boolean> {
 
   
 for (const email of emails) {
  const isSend = await this._EmailService.inviteMembers(email, invitaionLink);

}
return true
     }


}
