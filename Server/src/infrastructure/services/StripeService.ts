import Stripe from "stripe";
import { IStripeService } from "../../domain/interfaces/services/IStripService";
export const stripe = new Stripe(
  "sk_test_51S8KkWQZLJQHIIBAQy12rOmlMRK2hORCEajD1bZfPQ2FJWSVMOQLM4TwlwyyN4LuCk6EDbxsyLm5llzzvhGlmIlm00rDvap61a",
  { apiVersion: "2025-08-27.basil" }
);
export class StripeService implements IStripeService {
  constructor() {}

  async createCheckoutSession(
    name: any,
    customer_email: string,
    price: any
  ): Promise<any> {
    const response = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: "Ajjjj@gmail.com",
      line_items: [
        {
          price: "price_1S8hM3QZLJQHIIBAyGUG1mQk", // coming from frontend
          quantity: 1,
        },
      ],
      mode: "subscription", // or "payment" if one-time
      success_url: "http://localhost:5173/admin-dashboard",
      cancel_url: "http://localhost:5173/",
      metadata: {
        userName: "SuperArrow",
      },
    });
    console.log(response, "chechkout reponse");

    return response.url;
  }

  async createStripeCustomerId(email: string, name: string): Promise<any> {
    let stripeCustomer = await stripe.customers.create({ email, name });
    console.log(stripeCustomer, "stripcustomer from api 44444");
    return stripeCustomer;
  }

  async paymentMethods(
    paymentMethodId: string,
    stripeCustomerId: string
  ): Promise<any> {
    let paymentattched = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });
    console.log(paymentattched);
    return true;
  }

  async updateStripeOfCustomer(
    stripeCustomerId: string,
    paymentMethodId: string
  ): Promise<any> {
    try {
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      return true;
    } catch (error) {
      console.log(error, "csathc update customer");
    }
  }
  async createStripeSuscription(
    customer: string,
    items: any,
    expand: any,
    metadata: any
  ): Promise<any> {
    const sub = await stripe.subscriptions.create({
      customer,
      items,
      expand,
      metadata,
    });
    return sub;
  }
}
