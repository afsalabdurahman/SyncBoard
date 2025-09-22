// models/AuditLog.ts
import { Schema, model, Document } from 'mongoose';
export interface IAuditLog extends Document {
  user?: string; // user id or system
  action: string;
  detail?: any;
  ip?: string;
  createdAt: Date;
}
const AuditLogSchema = new Schema<IAuditLog>({
  user: String,
  action: String,
  detail: Schema.Types.Mixed,
  ip: String,
}, { timestamps: true });
export const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);
