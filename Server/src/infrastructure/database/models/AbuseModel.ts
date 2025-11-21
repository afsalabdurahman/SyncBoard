import mongoose, { Schema, Document, ObjectId, Types,model } from 'mongoose';
export interface AbuseDocument extends Document {
  description: string;
  type: string;
  otherType?: string;
  userId: Types.ObjectId;
  workspaceId:Types.ObjectId;
  severity: string;
  createdAt: Date;
  updatedAt: Date;
}
const AbuseSchema = new Schema<AbuseDocument>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    type: {
      type: String,
      enum: ["Spam", "Harassment", "Violence", "Other","Fraud","Copyright"],
      required: true,
    },

    otherType: {
      type: String,
      trim: true,
    },

    userId: {
      type: Schema.Types.ObjectId ,
      ref:'User', 
      required:true
    },
     workspaceId: {
      type: Schema.Types.ObjectId ,
      ref:'Workspace',
      // required:true 
      
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High","Critical"],
      required: true,
    },
 
   
  },
  {
    timestamps: true,
  }
);

export const AbuseModel = model<AbuseDocument>('Abuse', AbuseSchema);