import mongoose, { Schema, Types } from "mongoose";

const ChatAttachmentSchema = new mongoose.Schema(
  {
    name: { type: String },
    url: { type: String },
    type: { type: String }
  },
  { _id: false }
);

const ChatMessageSchema = new Schema(
  {
    workspaceId: {
      type: Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true
    },

    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    senderName: {
      type: String,
      required: true
    },

    content: {
      type: String,
      default: "" // Good: allows attachment-only messages
    },

    attachments: {
      type: [ChatAttachmentSchema],
      default: []   // ← FIXED: Use empty array, not null
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

export const ChatMessageModel = mongoose.model(
  "ChatMessage",
  ChatMessageSchema
);