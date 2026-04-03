

import mongoose, { Schema, Document } from "mongoose";
import { InvitationStatus } from "../../../types/inviteTypes";

export interface InvitationDocument extends Document {
  workspaceId?: mongoose.Types.ObjectId;
  invitedTo: string;
  status: InvitationStatus;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema = new Schema<InvitationDocument>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: false,
    },
    invitedTo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    acceptedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
  
);
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const InvitationModel = mongoose.model<InvitationDocument>(
  "Invitation",
  InvitationSchema
);