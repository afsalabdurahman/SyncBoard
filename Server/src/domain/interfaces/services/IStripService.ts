export interface IStripeService {
   createCheckoutSession(name:any,customer_email:string,price:any):Promise<any>
  createStripeCustomerId(email:string,name:string):Promise<any>
  paymentMethods(paymentMethodId:string,stripeCustomerId:string):Promise<any>
  updateStripeOfCustomer(stripeCustomerId:string,paymentMethodId :string):Promise<any>;
  createStripeSuscription(customer:string,items:any,expand:any,metadata:any):Promise<any>
}