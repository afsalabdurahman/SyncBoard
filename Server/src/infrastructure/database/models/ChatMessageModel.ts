import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  senderName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const ChatMessageModel = mongoose.model("ChatMessage", ChatMessageSchema);
