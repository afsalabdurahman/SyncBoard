import { inject, injectable } from "tsyringe";
import { IPlanUsecase } from "../../../repositories/IPlan";
import { IPlanRepository } from "../../../../domain/interfaces/repositories/IPlanRepository";
import { SuscriptionRequestDTO } from "../../../dto/SuscriptionDTOs";
import { NotFoundError, ValidationError } from "../../../../utils/errors";
import {IUserRepository} from "../../../../domain/interfaces/repositories/IUserRepository";
import { IStripeService } from "../../../../domain/interfaces/services/IStripService";
import { ISuscription } from "../../../../domain/interfaces/repositories/ISuscriptionRepository";
import { SuscriptionRepository } from "../../../../infrastructure/repositories/SuscriptionRepository";
import { ResponseMessages } from "../../../../common/erroResponse";
@injectable()
export class PlanUsecase implements IPlanUsecase {
constructor(@inject ('PlanRepository')private _planRepository:IPlanRepository, 
 @inject("IUserRepository") private _userRepository: IUserRepository,
 @inject("IStripeServices") private _stripeService: IStripeService,  
 @inject("SuscriptionRepository") private _suscriptionRepository: ISuscription, ){}


async excute(input: SuscriptionRequestDTO): Promise<string> {


    const myKey = await this._planRepository.findByKey(input.planKey.toLowerCase());
    if(!myKey) throw new ValidationError(ResponseMessages.NOT_FOUND + ' Key')
      const user = await this._userRepository.findById(input.userId) ;

      if(!user||!user._id) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND)

const haveSuscription = await this._suscriptionRepository.findSuscriptionByUserId(user._id) 
if(!SuscriptionRepository) throw new NotFoundError("Suscription not found");
const isCreateLink=await this._stripeService.createCheckoutSession(user.name,user.email,myKey.stripePriceId,user._id,myKey.key!)
      if(!isCreateLink) throw new ValidationError("Not a valid id")
            
        return isCreateLink
}

}