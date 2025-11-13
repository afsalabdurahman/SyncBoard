import Stripe from "stripe";
import {envConfig} from"../config/env.config"
import { IStripeService } from "../../domain/interfaces/services/IStripService";
import { ObjectId } from "mongodb";
export const stripe = new Stripe(
  envConfig.STRIP_KEY,
  { apiVersion: "2025-08-27.basil" }
);
export class StripeService implements IStripeService {
  constructor() {}

  async createCheckoutSession(
    name: any,
    customer_email: string,
    price: any,
    userId:any,
    key:string,
  ): Promise<any> {
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
        userId:id,
        planName:key
      },
      
    });


    return response.url;
  }

  async createStripeCustomerId(email: string, name: string): Promise<any> {
    let stripeCustomer = await stripe.customers.create({ email, name });
  
    return stripeCustomer;
  }

  async paymentMethods(
    paymentMethodId: string,
    stripeCustomerId: string
  ): Promise<any> {
    let paymentattched = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });
   
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
