import { Types } from "mongoose";

export class Plan {
  _id?: string| Types.ObjectId;
  key?: string;
  name?: string;
  priceCents?: number;
  billingInterval?: string;
  features?: string[];
  stripePriceId?: string;
  description?: string;

  constructor(
    _id?: string ,
    key?: string,
    name?: string,
    priceCents?: number,
    billingInterval?: string,
    features?: string[],
    stripePriceId?: string,
    description?: string
  ) {
    this.key = key;
    this.name = name;
    this.priceCents = priceCents;
    this.billingInterval = billingInterval || "month";
    this.features = features;
    this.stripePriceId = stripePriceId;
    this.description = description;
  }
}
