
import { Schema, model, Document } from 'mongoose';

export interface PlanDocument extends Document {
  key: 'free' | 'pro' | 'enterprise';
  name: string;
  priceCents: number; 
  billingInterval: 'month' | 'year';
  features: string[]; 
  stripePriceId?: string; 
  description?: string;
  status:"Active" | "Inactive";
  stripeProductId?:string
}

const PlanSchema = new Schema<PlanDocument>({
  key: { type: String, required: true, unique: true },
  name: String,
  priceCents: Number,
  billingInterval: { type: String, default: 'month' },
  features: [String],
  stripePriceId: String,
  description: String,
  status:{type:String,default:"Active"},
  stripeProductId:String
});

export const PlanModel = model<PlanDocument>('Plan', PlanSchema);
