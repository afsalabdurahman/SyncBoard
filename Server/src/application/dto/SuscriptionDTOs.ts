export interface SuscriptionRequestDTO{
userId:string ;
planKey:string;
status:"trailing" | "active" |"canceled";
//startedAt:Date,
//currentPeriodStart: Date,
   // currentPeriodEnd: Date,
   // cancelAtPeriodEnd: Date,
   // stripeSubscriptionId: string,
    stripePriceId: string
   // quantity: 1
   // metadata: any,
   // createdAt: Date,
   // updatedAt:  Date,

}
export interface SuscriptionReponseDTO{

    link:string,
}