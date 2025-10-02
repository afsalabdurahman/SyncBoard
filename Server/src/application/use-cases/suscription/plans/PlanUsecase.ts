import { inject, injectable } from "tsyringe";
import { IPlanUsecase } from "../../../repositories/IPlan";
import { IPlanRepository } from "../../../../domain/interfaces/repositories/IPlanRepository";
import { SuscriptionRequestDTO } from "../../../dto/SuscriptionDTOs";
import { NotFoundError, ValidationError } from "../../../../utils/errors";
import {IUserRepository} from "../../../../domain/interfaces/repositories/IUserRepository";
import { IStripeService } from "../../../../domain/interfaces/services/IStripService";
import { ISuscription } from "../../../../domain/interfaces/repositories/ISuscriptionRepository";
import { Subscription } from "../../../../domain/entities/Suscription";
import { SuscriptionRepository } from "../../../../infrastructure/repositories/SuscriptionRepository";
@injectable()
export class PlanUsecase implements IPlanUsecase {
constructor(@inject ('PlanRepository')private _planRepository:IPlanRepository,  @inject("IUserRepository") private _userRepository: IUserRepository,
 @inject("IStripeServices") private _stripeService: IStripeService,   @inject("SuscriptionRepository")
     private _suscriptionRepository: ISuscription, ){}


async excute(input: SuscriptionRequestDTO): Promise<string> {

console.log(input,"input+++++")

    const myKey = await this._planRepository.findByKey(input.planKey.toLowerCase());
    console.log(myKey,"my key in PlanUseCase")
    if(!myKey) throw new ValidationError("Price Not match")
      const user = await this._userRepository.findById(input.userId) ;
    
      console.log(user,"my User in PlanUseCase");
      if(!user||!user._id) throw new ValidationError("User not Found")

const haveSuscription = await this._suscriptionRepository.findSuscriptionByUserId(user._id) 
if(!SuscriptionRepository) throw new NotFoundError("Suscription not found");
//const upgradePlan = await this._suscriptionRepository.updateSuscriptionPlan(user._id,myKey.key,"unpaid")
const isCreateLink=await this._stripeService.createCheckoutSession(user.name,user.email,myKey.stripePriceId,user._id,myKey.key)
      if(!isCreateLink) throw new ValidationError("Not a valid id")
            console.log(isCreateLink,"linkecrearte plan usecse");

//       const entity = new Subscription({user:user._id,
//             planKey:myKey.planKey,status:"unpaid"})
// const createSuscription = this._suscriptionRepository.create(entity)
// if(!createSuscription) throw new  ValidationError("Suscription failed")

        return isCreateLink
}

}