
import { Schema, model, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
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
}

const SubscriptionSchema = new Schema<ISubscription>({
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
}, { timestamps: true });

export const SubscriptionModel = model<ISubscription>('Subscription', SubscriptionSchema);
