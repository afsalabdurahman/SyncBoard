import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { NotFoundError } from "../../../utils/errors";
import { ISentInvitaion } from "../../repositories/imail/ISentInvitation";

@injectable()
export class SentInvitaionUsecase implements ISentInvitaion {
  constructor(@inject("IEmailService") private EmailService: IEmailService) {}

  // async send(email: string[], invitaionLink: string): Promise<void> {
  //   console.log(email, "from usecase");
  //   // await this.EmailService.inviteMembers(, invitaionLink);
  // }
  async send(emails: string[], invitaionLink: string): Promise<boolean> {
    console.log(emails,"emai;f rom iusecases")
   
 for (const email of emails) {
  const isSend = await this.EmailService.inviteMembers(email, invitaionLink);

}
return true
     }

  //     async Send(email:string,invitaionLink:string):Promise<void>{
  //         console.log(email,"email is reved")
  // //        if (!this.EmailService.inviteMembers) {
  // //     throw new Error("EmailService not injected");
  // //   }
  //         try {
  //              await this.EmailService.inviteMembers(email,invitaionLink)
  //         } catch (error) {
  //             console.log(error,"usecaes")
  //         }

  //     }
}
