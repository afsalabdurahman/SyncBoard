
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { NotFoundError } from "../../../utils/errors";
import { ISuscriptionUsecase } from "../../../application/repositories/ISuscription";
import { IPlanUsecase } from "../../../application/repositories/IPlan";
import Stripe from "stripe";
import { SuscriptionRequestDTO } from "../../../application/dto/SuscriptionDTOs";

import { HttpStatusCode } from "../../../common/errorCodes";

import { envConfig } from "../../../infrastructure/config/env.config";

    const stripe = new Stripe(envConfig.STRIP_KEY, {
  apiVersion: "2025-08-27.basil"
})
const STRIPE_WEBHOOK_SECRET = envConfig.STRIPE_WEBHOOK_SECRET || ""
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
  ): Promise<void> {
    try {
      console.log(req.body,"bodyyydd")
      const input: SuscriptionRequestDTO = {
        userId: req.params.userid,
        planKey: req.body.plan,

      }
        const checkoutLink = await this._planUsecase.excute(input);
        res.status(HttpStatusCode.OK).json(checkoutLink)

    } catch (error) {
      console.log(error);
    }
  }



  async webHookNotify(req: Request, res: Response, next: NextFunction) {
    console.log("calleing webHOok")
    // console.log(req.headers,"heder")
 const sig = req.headers["stripe-signature"] as string;
 console.log(sig,"sigggg")
    if (!sig) {
      res.status(400).send("Missing Stripe signature");
      return;
    }
     let event: Stripe.Event;
// try

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        STRIPE_WEBHOOK_SECRET
      );
console.log(event,"event...")
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    switch (event.type) {
  case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("🎉 Checkout completed:5550", session);

        if (session.metadata) {
          console.log(session.metadata,"metaDta os seion...")
          await this._suscriptionUsecase.updateSuscriptionPlan(session.metadata.userId, session.metadata.planName, "active")
        }
        break;
        case "invoice.paid":

//         case "charge.succeeded":
          const invoice = event.data.object as Stripe.Invoice
           console.log(invoice,"Invoice1010")
if(invoice.customer_name && invoice.customer_email&&invoice.hosted_invoice_url){
 await this._suscriptionUsecase.sendReceipt(invoice.customer_name,invoice.customer_email,invoice.hosted_invoice_url)
}
         
   res.sendStatus(200);
 break;

            
    }
next()

  }
  async getSuscription(req: Request, res: Response, next: NextFunction) {

    const subscription = await this._suscriptionUsecase.getSuscription(req.params.userid);

    res.status(HttpStatusCode.OK).json(subscription)
  }
}
