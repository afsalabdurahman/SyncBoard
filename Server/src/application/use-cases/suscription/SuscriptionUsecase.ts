import { inject, injectable } from "tsyringe";
import { ISuscriptionUsecase } from "../../repositories/ISuscription";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ISuscription } from "../../../domain/interfaces/repositories/ISuscriptionRepository";
import { IStripeService } from "../../../domain/interfaces/services/IStripService";

@injectable()
export class SubscriptionUsecase implements ISuscriptionUsecase {
  constructor(
    @inject("SuscriptionRepository")
    private _suscriptionRepository: ISuscription,
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IStripeServices") private istripeService: IStripeService
  ) {}

   getSuscription(userid:string){
return this._suscriptionRepository.findSuscriptionByUserId(userid)
   }
}
