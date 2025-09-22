import { inject, injectable } from "tsyringe";
import { ISuscriptionUsecase } from "../../repositories/ISuscription";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ISuscription } from "../../../domain/interfaces/repositories/ISuscriptionRepository";
import { NotFoundError } from "../../../utils/errors";
import { User } from "../../../domain/entities/User";
import { IStripeService } from "../../../domain/interfaces/services/IStripService";

@injectable()
export class SubscriptionUsecase implements ISuscriptionUsecase {
  constructor(
    @inject("SuscriptionRepository")
    private SuscriptionRepository: ISuscription,
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IStripeServices") private istripeService: IStripeService
  ) {}

  async excute(
    userId: string,
    planKey: string,
    paymentMethodId: string,
    quantity: number,
    myplan: any
  ): Promise<any> {



  let result = await this.istripeService.createCheckoutSession("jdgj","fusuif","fjsgjf")
  return result 
  //   let user = await this.userRepository.findById(userId);
  
  //   if (!user) throw new NotFoundError("User not found");

  //   let stripeCustomerIds = user.stripeCustomerId;
  //   console.log(stripeCustomerIds, "striCusId 222222");
  //   if (!stripeCustomerIds) {
  //     let cust = await this.istripeService.createStripeCustomerId(
  //       user.email,
  //       user.name
  //     );
  //     stripeCustomerIds = cust.id;
  //     await this.userRepository.updateUser(userId, "stripeCustomerId", cust.id);
  //   }

    
  //   if (paymentMethodId && stripeCustomerIds) {
  //     console.log(
  //       paymentMethodId,
  //       stripeCustomerIds,
  //       "patmtMthod+stri[pCustId 3333"
  //     );
  //     const payamentMethode=await this.istripeService.paymentMethods(paymentMethodId,stripeCustomerIds)
  //     const stripCustomer=await this.istripeService.createStripeCustomerId(user.email, user.name);
     
  //     await this.istripeService.updateStripeOfCustomer(
  //       stripeCustomerIds,
  //       paymentMethodId
  //     );
  //   }
  //   if (!stripeCustomerIds) throw new NotFoundError("Not found customer");
  //   const sub: any = await this.istripeService.createStripeSuscription(
  //     stripeCustomerIds,
  //     [{ price: "price_1S8hM3QZLJQHIIBAyGUG1mQk", quantity }],
  //     ["latest_invoice.payment_intent"],
  //     { userId: userId }
  //   );
  //   console.log(sub, "sub++++++66666");
  //   if (!sub) throw new NotFoundError("subnot ");
  //   //Save todb

  //   const dbSub = {
  //     user: user._id,
  //     planKey: planKey,
  //     status: sub?.status,
  //     startedAt: new Date(sub.start_date * 1000),
  //     currentPeriodStart: new Date(sub.current_period_start * 1000),
  //     currentPeriodEnd: new Date(sub.current_period_end * 1000),
  //     stripeSubscriptionId: sub.id,
  //     stripePriceId: myplan.stripePriceId,
  //   };
  //   await this.SuscriptionRepository.create(dbSub);
   }
}
