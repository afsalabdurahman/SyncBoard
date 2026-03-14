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
  status?:string;
  stripeProductId?:string;

  constructor(
    _id?: string | Types.ObjectId,
    key?: string,
    name?: string,
    priceCents?: number,
    billingInterval?: string,
    features?: string[],
    stripePriceId?: string,
    description?: string,
    status?:string,
    stripeProductId?:string
  ) {
    this._id =_id;
    this.key = key;
    this.name = name;
    this.priceCents = priceCents;
    this.billingInterval = billingInterval || "month";
    this.features = features;
    this.stripePriceId = stripePriceId;
    this.description = description;
    this.status = status;
    this.stripeProductId = stripeProductId
  }
}
