
import { Schema, Document, model } from "mongoose";
interface OTPDocument extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expAt: Date;
}

const OTPschema: Schema<OTPDocument> = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expAt: { type: Date, required: true },
});
OTPschema.index({ expAt: 1 }, { expireAfterSeconds: 0 });

export const OTPModel = model<OTPDocument>("OTP", OTPschema) 
