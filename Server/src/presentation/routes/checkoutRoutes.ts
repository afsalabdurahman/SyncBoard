import express from "express";
import { Request, Response } from "express";
import {SubscriptionController} from "../controllers/suscription/SuscriptionController"
import { stripe } from "../../infrastructure/services/StripeService";
import { injectable,container } from "tsyringe";
import bodyParser from "body-parser";


const router = express.Router();
const suscriptionController=container.resolve(SubscriptionController)

router.post("/payment/:userid",suscriptionController.addCheckout.bind(suscriptionController))
//router.post("pay/webhook", bodyParser.raw({ type: "application/json" }),suscriptionController.webHookNotify.bind(suscriptionController))




// router.post("/pay", async (req: Request, res: Response) => {
//   try {
//     const user: any = {
//       _id: "dummyUserId123",
//       email: "testuser@example.com",
//       name: "Dummy User",
//       save: async () => console.log("Dummy user saved")
//     };
//     console.log(req.body, user);
//     const { planKey, quantity = 1 } = req.body;
//     // const plan = await Plan.findOne({ key: planKey });

//         const cust = await stripe.customers.create({
//       email: user.email,
//       name: user.name
//     });
//     console.log(cust,":stricustom")
//   const stripeCustomerId = cust.id;
//     const paymentMethod = await stripe.paymentMethods.create({
//       type: "card",
//       card: { token: "tok_visa" } // Stripe test card
//     });
// console.log(paymentMethod,":stripPatmethode")
//    let attchement=await stripe.paymentMethods.attach(paymentMethod.id, {
//       customer: stripeCustomerId
//     });
//     console.log(attchement,"stripattchment")
//       // set default
//         await stripe.customers.update(stripeCustomerId, {
//       invoice_settings: { default_payment_method: paymentMethod.id }
//     });
    
//     const sub = await stripe.subscriptions.create({
//   customer: stripeCustomerId,
//   items: [{ price: "price_1S8hM3QZLJQHIIBAyGUG1mQk", quantity }], // real price from dashboard
//   expand: ["latest_invoice.payment_intent"],
//   metadata: { userId: user._id.toString() }
// });
//     const paymentIntent = (sub.latest_invoice as any)?.payment_intent;
// console.log(sub)
//     res.json({
//       subscriptionId: sub.id,
//       status: sub.status,
//       clientSecret: paymentIntent?.client_secret ?? null,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

export default router;
