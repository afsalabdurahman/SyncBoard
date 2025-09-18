import express from "express";
import { Request, Response } from "express";
import { stripe } from "../../infrastructure/services/StripeService";
const router = express.Router();

router.post("/pay", async (req: Request, res: Response) => {
  try {
    const user: any = {
      _id: "dummyUserId123",
      email: "testuser@example.com",
      name: "Dummy User",
      save: async () => console.log("Dummy user saved")
    };
    console.log(req.body, user);
    const { planKey, quantity = 1 } = req.body;
    // const plan = await Plan.findOne({ key: planKey });

        const cust = await stripe.customers.create({
      email: user.email,
      name: user.name
    });
  const stripeCustomerId = cust.id;
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" } // Stripe test card
    });

   await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: stripeCustomerId
    });
      // set default
        await stripe.customers.update(stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethod.id }
    });
    
    const sub = await stripe.subscriptions.create({
  customer: stripeCustomerId,
  items: [{ price: "price_1S8OPVQZLJQHIIBA9ImjadIj", quantity }], // real price from dashboard
  expand: ["latest_invoice.payment_intent"],
  metadata: { userId: user._id.toString() }
});
    const paymentIntent = (sub.latest_invoice as any)?.payment_intent;

    res.json({
      subscriptionId: sub.id,
      status: sub.status,
      clientSecret: paymentIntent?.client_secret ?? null,
    });
  } catch (err) {
    console.log(err);
  }
});

export default router;
