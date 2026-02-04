// models/Invoice.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface InvoiceDocument extends Document {
  user: Types.ObjectId;
  subscription?: Types.ObjectId;
  stripeInvoiceId?: string;
  amountDueCents: number;
  status: 'open' | 'paid' | 'void' | 'failed';
  hostedInvoiceUrl?: string;
  periodStart?: Date;
  periodEnd?: Date;
  raw?: any;
  createdAt: Date;
}

const InvoiceSchema = new Schema<InvoiceDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' },
  stripeInvoiceId: String,
  amountDueCents: Number,
  status: String,
  hostedInvoiceUrl: String,
  periodStart: Date,
  periodEnd: Date,
  raw: Schema.Types.Mixed,
}, { timestamps: true });

export const Invoice = model<InvoiceDocument>('Invoice', InvoiceSchema);
