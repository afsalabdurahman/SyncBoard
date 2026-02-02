import Stripe from "stripe";
import { SubscriptionDocument } from "../../../infrastructure/database/models/SuscriptionModel";

export interface IStripeService {
   createCheckoutSession(name:string,customer_email:string,price:string,userId:string,key:string):Promise<string>
  createStripeCustomerId(email:string,name:string):Promise<Stripe.Customer>
  paymentMethods(paymentMethodId:string,stripeCustomerId:string):Promise<boolean>
  updateStripeOfCustomer(stripeCustomerId:string,paymentMethodId :string):Promise<boolean>;
  createStripeSuscription(customer:string,items:Array<Stripe.SubscriptionCreateParams.Item>,expand: Array<string>,metadata:Record<string, string>):Promise<Stripe.Subscription>
}