import { Server } from "socket.io";
import { MemberController } from "../../presentation/controllers/member/MemberController";
import { ChatController } from "../../presentation/controllers/chat/ChatController";
import { container } from "tsyringe";

const chatController = container.resolve(ChatController);
const memberController = container.resolve(MemberController);
export const initSocketServer = (io: Server) => {
  io.on("connect", async (socket) => {


    socket.on("UserId", async (userId) => {
    
      io.emit("userStatus", userId);
      await memberController.changeOnlinestatus(userId);
      
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
