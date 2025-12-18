import { inject, injectable } from "tsyringe";
import { ISuscriptionUsecase } from "../../repositories/ISuscription";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ISuscription } from "../../../domain/interfaces/repositories/ISuscriptionRepository";
import { IStripeService } from "../../../domain/interfaces/services/IStripService";
import { SubscriptionDocument } from "../../../infrastructure/database/models/SuscriptionModel";
import { ResponseMessages } from "../../../common/erroResponse";
import { NotFoundError } from "../../../utils/errors";

@injectable()
export class SubscriptionUsecase implements ISuscriptionUsecase {
  constructor(
    @inject("SuscriptionRepository")
    private _suscriptionRepository: ISuscription,
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IStripeServices") private istripeService: IStripeService
  ) {}


  async getSuscription(userid: string): Promise<SubscriptionDocument> {
    const suscriptions = await this._suscriptionRepository.findSuscriptionByUserId(userid);
    if (!suscriptions) throw new NotFoundError(ResponseMessages.NOT_FOUND);
    return suscriptions;
  }

   
}
