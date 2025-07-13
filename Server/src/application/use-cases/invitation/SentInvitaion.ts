import { injectable,inject } from "tsyringe";
import {IEmailService} from"../../../domain/interfaces/services/IEmailServices"
injectable
@injectable()
export class SentInvitaion {
    constructor(@inject ("IEmailService") private EmailService:IEmailService){}
    async Send(email:string,invitaionLink:string):Promise<void>{
       if (!this.EmailService.inviteMembers) {
    throw new Error("EmailService not injected");
  }
        try {
             this.EmailService.inviteMembers(email,invitaionLink)
        } catch (error) {
            console.log(error,"usecaes")
        }

    }
}