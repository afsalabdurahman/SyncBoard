import { Server } from "socket.io";
// import { SendMessage } from "../../application/use-cases/Workapace/chat/SendMessage";
// import { ChatRepositoryMongo } from "../../domain/repositories/ChatRepository";


export const initSocketServer = (io: Server) => {
//   const chatRepo = new ChatRepositoryMongo();
//   const sendMessage = new SendMessage(chatRepo);

  io.on("connection", async (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // Send existing messages
//     socket.on("get-chat-history", async () => {
//     const messages = await chatRepo.findAll(); // or add pagination
//     console.log("Sending history:", messages);
//     socket.emit("chat-history", messages);
//   });
    // Listen to new messages
    // socket.on("send-message", async (msgData) => {
    //     console.log(msgData,"send message data...")
    //   const savedMsg = await sendMessage.execute(msgData);
    //   io.emit("receive-message", savedMsg); // broadcast to all
    // });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};
