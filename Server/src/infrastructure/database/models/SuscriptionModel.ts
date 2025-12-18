
import { Schema, model, Document, Types } from 'mongoose';
import { IPaymentMethod } from '../../../types/subscriptionTypes';

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    brand: { type: String, required: true },
    lastFour: { type: Schema.Types.Mixed, required: true },
    expMonth: { type: Number, required: true },
    expYear: { type: Number, required: true },
  },
  { _id: false } 
);



export interface SubscriptionDocument extends Document {
  user: Types.ObjectId;
  workspace:Types.ObjectId;
  planKey: string; 
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'expired';
  startedAt?: Date;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  quantity?: number; 
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  paymentMethode?:IPaymentMethod;
}




const SubscriptionSchema = new Schema<SubscriptionDocument>({
   user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workspace:{ type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  planKey: { type: String, required: true,default:"free" },
  status: { type: String, required: true, default: 'trialing' },
  startedAt: Date,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: { type: Boolean, default: false },
  stripeSubscriptionId: String,
  stripePriceId: String,
  quantity: { type: Number, default: 1 },
  metadata: { type: Schema.Types.Mixed, default: {} },
  paymentMethode:PaymentMethodSchema
}, { timestamps: true });

export const SubscriptionModel = model<SubscriptionDocument>('Subscription', SubscriptionSchema);
