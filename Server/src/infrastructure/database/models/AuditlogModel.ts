
import { Schema, model, Document } from 'mongoose';
export interface AuditLogDocument extends Document {
  user?: string; 
  action: string;
  detail?: any;
  ip?: string;
  createdAt: Date;
}
const AuditLogSchema = new Schema<AuditLogDocument>({
  user: String,
  action: String,
  detail: Schema.Types.Mixed,
  ip: String,
}, { timestamps: true });
export const AuditLog = model<AuditLogDocument>('AuditLog', AuditLogSchema);
