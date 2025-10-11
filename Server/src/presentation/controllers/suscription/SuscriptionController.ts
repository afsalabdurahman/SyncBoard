
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { NotFoundError } from "../../../utils/errors";
import { ISuscriptionUsecase } from "../../../application/repositories/ISuscription";
import { IPlanUsecase } from "../../../application/repositories/IPlan";
import Stripe from "stripe";
import { SuscriptionRequestDTO } from "../../../application/dto/SuscriptionDTOs";

import { HttpStatusCode } from "../../../common/errorCodes";

import { envConfig } from "../../../infrastructure/config/env.config";



@injectable()
export class SubscriptionController {
  private stripe: Stripe;
  constructor(
    @inject("SuscriptionUsecase")
    private _suscriptionUsecase: ISuscriptionUsecase,
    @inject("PlanUsecase") private _planUsecase: IPlanUsecase
  ) {
    this.stripe = new Stripe(envConfig.STRIP_KEY, {
      apiVersion: "2025-08-27.basil",
    });
  }

  async addCheckout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const input: SuscriptionRequestDTO = {
        userId: req.params.userid,
        planKey: req.body.plan,

      }



      try {
        const checkoutLink = await this._planUsecase.excute(input);
        res.status(HttpStatusCode.OK).json(checkoutLink)
      } catch (error) {

        next(error)
      }


    } catch (error) {
      console.log(error);
    }
  }




  async webHookNotify(req: Request, res: Response, next: NextFunction) {

    const sig = req.headers['stripe-signature'];
    if (!sig) throw new NotFoundError("not")
    const webhookSecret = "whsec_ACzBWp9X0UpQz0L386urekrn0vkX1UM4";
    try {
      const event = this.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          console.log(`Checkout completed: ${session.id}, Amount: ${session?.amount_total || 500 / 100} ${session.currency}`);
          ;
          break;
        case 'checkout.session.async_payment_succeeded':
          console.log(`Async payment succeeded: ${event.data.object.id}`);
          break;
        default:
          console.log(`Unhandled event: ${event.type}`);
      }
      res.status(200).json({ received: true });
    } catch (error) {

    }




  }
  async getSuscription(req: Request, res: Response, next: NextFunction) {

    const subscription = await this._suscriptionUsecase.getSuscription(req.params.userid);

    res.status(HttpStatusCode.OK).json(subscription)
  }
}
