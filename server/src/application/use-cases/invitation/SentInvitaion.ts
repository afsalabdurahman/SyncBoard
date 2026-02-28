import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { ISentInvitaion } from "../../repositories/imail/ISentInvitation";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { AuthMapper } from "../../mappers/AuthMapper";
import { ValidationError } from "../../../utils/errors";

@injectable()
export class SentInvitaionUsecase implements ISentInvitaion {
  constructor(@inject("IEmailService") private _EmailService: IEmailService,
 @inject("UserRepository") private _userRepository: IUserRepository
) {}

   async send(emails: string[], invitaionLink: string): Promise<boolean> {

console.log(emails,"email",invitaionLink,"invitaion")
 for (const email of emails) {
const isValid= AuthMapper.emailValidator(email);
 if (!isValid.success) throw new ValidationError( isValid.error.issues[0].message);
const isSend = await this._EmailService.inviteMembers(email, invitaionLink);
}
  


return true
     


}
}