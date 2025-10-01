import { error } from "console";
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { NotFoundError } from "../../../utils/errors";
import { ISuscriptionUsecase } from "../../../application/repositories/ISuscription";
import { IPlanUsecase } from "../../../application/repositories/IPlan";
import Stripe from "stripe";
import { SuscriptionRequestDTO } from "../../../application/dto/SuscriptionDTOs";
import {nextMonth} from "../../../utils/dateCoverter"
import { HttpStatusCode } from "../../../common/errorCodes";
import bodyParser from "body-parser";
import { envConfig } from "../../../infrastructure/config/env.config";



@injectable()
export class SubscriptionController {
  private stripe: Stripe;
  constructor(
    @inject("SuscriptionUsecase")
    private suscriptionUsecase: ISuscriptionUsecase,
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
const input:SuscriptionRequestDTO={
  userId:req.params.userid,
planKey:req.body.plan,

}
console.log(req.body,"body from addchekcout")


try{
const checkoutLink = await this._planUsecase.excute(input);
 res.status(HttpStatusCode.OK).json(checkoutLink)
}catch(error){
  console.log(error,"show me error checkout......Controler checkout")
  next(error)
}

    //   const { planKey, paymentMethodId, quantity = 1, email } = req.body;
    //   console.log(req.body, "body", planKey, "keysssss");

    //   console.log(req.params.id, "params", req.query.id, "qury");
    //   //let userId=req.query.id
    //   //if(!planKey || !paymentMethodId || !quantity) throw new NotFoundError("Please select suscription");
    //   const myplan = await this.planUsecase.excute(planKey);
    //   console.log(myplan, "my plan$$$");
    //   if (!myplan) throw new NotFoundError("Plan are not found");
   // let repos=  await this.suscriptionUsecase.excute("ughu","ighsih","shgki",2555) ;
     // res.json("repos");
    } catch (error) {
      console.log(error);
    }
  }



//   async webHookNotify(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     console.log("webHokk Calling.....")
//     console.log(req.headers,"heder#######")
  
//     const sig = req.headers["stripe-signature"] as string;
// const webhookSecret = "whsec_ACzBWp9X0UpQz0L386urekrn0vkX1UM4";

//     if (!sig) {
//       res.status(400).send("Missing Stripe signature");
//       return;
//     }

//     let event: Stripe.Event;
// console.log(req.body,"body .........")
//     try {
//       event = this.stripe.webhooks.constructEvent(
//         req.body, // must be raw body
//         sig,
//         webhookSecret // ✅ use webhook secret, not API key
//       );
//     } catch (err: any) {
//       console.error("⚠️ Webhook signature verification failed:", err.message);
//       res.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }

//     try {
//       switch (event.type) {
//         case "checkout.session.completed": {
//           const session = event.data.object as Stripe.Checkout.Session;
//           console.log("✅ Checkout completed:", session.id);

//           // 👉 Example: Save subscription in DB
//           // await this.suscriptionUsecase.create({
//           //   userId: session.metadata.userId,
//           //   planKey: session.metadata.planKey,
//           //   stripeSessionId: session.id,
//           //   status: "active",
//           // });

//           break;
//         }

//         case "invoice.payment_failed": {
//           const invoice = event.data.object as Stripe.Invoice;
//           console.log("❌ Payment failed:", invoice.id);

//           // 👉 Example: Mark subscription as unpaid
//           // await this.suscriptionUsecase.updateStatus(invoice.customer, "unpaid");

//           break;
//         }

//         default:
//           console.log(`Unhandled event type ${event.type}`);
//       }

//       res.sendStatus(200); // ✅ always respond once
//     } catch (err) {
//       console.error("❌ Error while handling webhook:", err);
//       // Still acknowledge to avoid endless retries
//       res.sendStatus(200);
//     }
//   }

async webHookNotify(req: Request, res: Response, next: NextFunction){
  console.log("WebHokk is calling .....")
const sig = req.headers['stripe-signature'];
if(!sig) throw new NotFoundError("not")
const webhookSecret = "whsec_ACzBWp9X0UpQz0L386urekrn0vkX1UM4";
try {
  const event = this.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  console.log('Webhook received:', event.type); //
  switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(`Checkout completed: ${session.id}, Amount: ${session?.amount_total||500 / 100} ${session.currency}`);
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
async getSuscription(req: Request, res: Response, next: NextFunction){
  console.log("calling suscription ...")
console.log(req.params.userid,"iddd")
 const subscription= await this.suscriptionUsecase.getSuscription(req.params.userid);
 console.log(subscription,"Omigo")
 res.status(HttpStatusCode.OK).json(subscription)
}
}
