import { Server } from "socket.io";
// import { SendMessage } from "../../application/use-cases/Workapace/chat/SendMessage";
// import { ChatRepositoryMongo } from "../../domain/repositories/ChatRepository";

import { ChatController } from "../../presentation/controllers/chat/ChatController";
import { container } from "tsyringe";
import { AuthService } from "./AuthService";
const chatController = container.resolve(ChatController);

export const initSocketServer = (io: Server) => {
  io.on("connect", async (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("UserId", async (userId) => {
      console.log(userId, "333");
      io.emit("userStatus", userId);
    });

    socket.on("send-message", async (msgData) => {
      console.log(msgData, "send message data...");

      io.emit("receive-message", msgData);

      await chatController.saveMessage(msgData);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};
