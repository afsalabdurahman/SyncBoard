import { ObjectId } from "mongoose";

export class Subscription {
  user: ObjectId;
  planKey: string;
  status: string;
  startedAt: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
  stripePriceId?: string;
  quantity?: number;
  metadata?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    user: ObjectId,
    planKey: string,
    status: string,
    startedAt: Date,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: boolean,
    stripeSubscriptionId: string,
    stripePriceId?: string,
    quantity?: number,
    metadata?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.user = user;
    this.planKey = planKey;
    this.status = status;
    this.startedAt = startedAt;
    this.currentPeriodStart = currentPeriodStart;
    this.currentPeriodEnd = currentPeriodEnd;
    this.cancelAtPeriodEnd = cancelAtPeriodEnd;
    this.stripeSubscriptionId = stripeSubscriptionId; // Fixed typo
    this.stripePriceId = stripePriceId;
    this.quantity = quantity;
    this.metadata = metadata;
    this.createdAt = createdAt || new Date(); // Default to current date if not provided
    this.updatedAt = updatedAt || new Date(); // Default to current date if not provided
  }
}