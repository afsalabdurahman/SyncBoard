import { inject, injectable } from "tsyringe";
import { ISuscriptionUsecase } from "../../repositories/ISuscription";
import { ISuscription } from "../../../domain/interfaces/repositories/ISuscriptionRepository";
import { ResponseMessages } from "../../../common/erroResponse";
import { NotFoundError } from "../../../utils/errors";
import { Subscription } from "../../../domain/entities/Suscription";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { stringToMongoObj } from "../../../utils/convertMongoObject";

@injectable()
export class SubscriptionUsecase implements ISuscriptionUsecase {
  constructor(
    @inject("SuscriptionRepository")
    private _suscriptionRepository: ISuscription,
    @inject("IEmailService") private _EmailService: IEmailService,
    @inject("IResendMailService") private _resendMailService: IEmailService
  ) { }


  async getSuscription(userid: string): Promise<Subscription> {
    const suscriptions = await this._suscriptionRepository.findSuscriptionByUserId(userid);
    if (!suscriptions) throw new NotFoundError(ResponseMessages.NO_CONTENT);
    return suscriptions;
  }
  async updateSuscriptionPlan(userId: string, planName: string, status: string): Promise<Subscription | null> {

    const updatedSubscription = await this._suscriptionRepository.updateSuscriptionPlan(userId, planName, status)
    return updatedSubscription
  }
  async sendReceipt(name: string, email: string, link: string): Promise<void> {
    await this._resendMailService.sendReceipts(name, email, link)

  }
  async updateHistory(userId: string, id: string, date: Date, amount: number, status: string): Promise<void> {
    await this._suscriptionRepository.updateHistory(stringToMongoObj(userId.toString()), id, date, amount, status)
  }

}
