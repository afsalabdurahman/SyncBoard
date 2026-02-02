import Stripe from "stripe";
import { envConfig } from "../config/env.config"
import { IStripeService } from "../../domain/interfaces/services/IStripService";
import { ObjectId } from "mongodb";
import { InternalServerError, NotFoundError, ValidationError } from "../../utils/errors";
import { ResponseMessages } from "../../common/erroResponse";
export const stripe = new Stripe(
  envConfig.STRIP_KEY,
  { apiVersion: "2025-08-27.basil" }
);
export class StripeService implements IStripeService {
  constructor() { }

  async createCheckoutSession(
    name: string,
    customer_email: string,
    price: string,
    userId: string,
    key: string,
  ): Promise<string> {
    const id = userId.toString();

    const response = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],
      customer_email: customer_email,
      line_items: [
        {
          price: price, // coming from frontend
          quantity: 1,
        },
      ],
      mode: "subscription", // or "payment" if one-time,

      success_url: envConfig.STRIPE_PAYMENT_SUCCESS,
      cancel_url: envConfig.STRIPE_PAYMENT_CANCEL,
      metadata: {
        userName: name,
        userId: id,
        planName: key
      },

    });
    if (!response.url) throw new NotFoundError(ResponseMessages.NOT_FOUND)

    return response.url;
  }

  async createStripeCustomerId(email: string, name: string): Promise<Stripe.Customer> {
    let stripeCustomer = await stripe.customers.create({ email, name });

    return stripeCustomer;
  }

  async paymentMethods(
    paymentMethodId: string,
    stripeCustomerId: string
  ): Promise<boolean> {
    let paymentattched = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    return true;
  }

  async updateStripeOfCustomer(
    stripeCustomerId: string,
    paymentMethodId: string
  ): Promise<boolean> {
    try {
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      return true;
    } catch (error) {
throw new InternalServerError("Something went to wrong")
    }
  }
  async createStripeSuscription(
    customer: string,
    items: Array<Stripe.SubscriptionCreateParams.Item>,
    expand: Array<string>,
    metadata: Record<string, string>
  ): Promise<Stripe.Subscription> {
    const sub = await stripe.subscriptions.create({
      customer,
      items,
      expand,
      metadata,
    });
    return sub;
  }
}
