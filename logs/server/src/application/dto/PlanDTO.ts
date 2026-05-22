export interface PlanRequestDTO {
  key?:string;
  stripePriceId?:string;
  name: string;
  description: string;
  priceCents: number;
  billingInterval: "month" | "year";
  features: string[];
  status: string;
  stripeProductId?:string;

}
