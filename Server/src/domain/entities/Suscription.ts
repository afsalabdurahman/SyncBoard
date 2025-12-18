import mongoose, { Mongoose, Types } from "mongoose";
import {IPaymentMethod} from"../../types/subscriptionTypes"


export class Subscription {
  user: string | Types.ObjectId;
  workspace: string | Types.ObjectId;
  planKey: string;
  status: string;
  startedAt?: Date;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  quantity?: number;
  metadata?: string;
  createdAt?: Date;
  updatedAt?: Date;
  paymentMethode?: IPaymentMethod;
  constructor(params: {
    user: string | Types.ObjectId;
    workspace: string | Types.ObjectId ;
    planKey: string;
    status: string;
    startedAt?: Date;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    quantity?: number;
    metadata?: string;
    createdAt?: Date;
    updatedAt?: Date;
    paymentMethode?: IPaymentMethod
  }) {
    this.user = params.user;
    this.workspace = params.workspace;
    this.planKey = params.planKey;
    this.status = params.status;

    this.startedAt = params.startedAt ?? new Date();
    this.currentPeriodStart = params.currentPeriodStart ?? new Date();
    this.currentPeriodEnd =
      params.currentPeriodEnd ??
      new Date(new Date().setMonth(new Date().getMonth() + 1));
    this.cancelAtPeriodEnd = params.cancelAtPeriodEnd ?? false;

    this.stripeSubscriptionId = params.stripeSubscriptionId ?? "not available";
    this.stripePriceId = params.stripePriceId;
    this.quantity = params.quantity ?? 1;
    this.metadata = params.metadata ?? "";

    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.paymentMethode = params.paymentMethode
  }
}
