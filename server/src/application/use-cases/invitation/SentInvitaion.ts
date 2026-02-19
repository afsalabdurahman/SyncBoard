import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { ISentInvitaion } from "../../repositories/imail/ISentInvitation";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ConflictError } from "../../../utils/errors";

@injectable()
export class SentInvitaionUsecase implements ISentInvitaion {
  constructor(@inject("IEmailService") private _EmailService: IEmailService,
 @inject("UserRepository") private _userRepository: IUserRepository
) {}

   async send(emails: string[], invitaionLink: string): Promise<boolean> {
 

 for (const email of emails) {

const isSend = await this._EmailService.inviteMembers(email, invitaionLink);
}
  


return true
     


}
}