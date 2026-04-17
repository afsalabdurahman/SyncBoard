
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { ISuscriptionUsecase } from "../../../application/repositories/ISuscription";
import { IPlanUsecase } from "../../../application/repositories/IPlan";
import Stripe from "stripe";
import { SuscriptionRequestDTO } from "../../../application/dto/SuscriptionDTOs";

import { HttpStatusCode } from "../../../common/errorCodes";

import { envConfig } from "../../../infrastructure/config/env.config";

const stripe = new Stripe(envConfig.STRIP_KEY, {
  apiVersion: "2025-08-27.basil"
})
const STRIPE_WEBHOOK_SECRET = envConfig.STRIPE_WEBHOOK_SECRET || "";

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
    
      const input: SuscriptionRequestDTO = {
        userId: req.params.userid,
        planKey: req.body.plan,

      }
      const checkoutLink = await this._planUsecase.excute(input);
      console.log(checkoutLink,"in controller link")
      res.status(HttpStatusCode.OK).json(checkoutLink)

    } catch (error) {
      next(error);
    }
  }



  async webHookNotify(req: Request, res: Response, next: NextFunction) {

console.log("webHokkCalling")
    const sig = req.headers["stripe-signature"] as string;

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

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("❌ Webhook signature verification failed:", err.message);
      } else {
        console.error("❌ Webhook signature verification failed:", err);
      }
      res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`);
      return;
    }
    switch (event.type) {
      case "checkout.session.completed":
        { const session = event.data.object as Stripe.Checkout.Session;
await this._suscriptionUsecase.updateHistory(session?.metadata?.userId.toString()??"",session.id,new Date(),session?.amount_subtotal??0,session.payment_status)
        if (session.metadata) {
          
          await this._suscriptionUsecase.updateSuscriptionPlan(session.metadata.userId, session.metadata.planName, "active")
        }
        break; }
      case "invoice.paid":

        //         case "charge.succeeded":
        { const invoice = event.data.object as Stripe.Invoice
        if (invoice.customer_name && invoice.customer_email && invoice.hosted_invoice_url) {
          await this._suscriptionUsecase.sendReceipt(invoice.customer_name, invoice.customer_email, invoice.hosted_invoice_url)
        }
console.log(event,"envents")
        res.sendStatus(200);
        break; }


    }
    next()

  }
  async getSuscription(req: Request, res: Response, ) {

    const subscription = await this._suscriptionUsecase.getSuscription(req.params.userid as string);

    res.status(HttpStatusCode.OK).json(subscription)
  }
  async getActivePlans(req:Request,res:Response,next:NextFunction){
  try {
      const plans = await this._planUsecase.findActivePlan();
       res.status(HttpStatusCode.OK).json(plans)
  } catch (error) {
    next(error)
  }

  }
  
}
