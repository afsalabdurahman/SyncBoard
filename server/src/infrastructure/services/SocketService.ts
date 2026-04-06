import { Server } from "socket.io";
import { MemberController } from "../../presentation/controllers/member/MemberController";
import { ChatController } from "../../presentation/controllers/chat/ChatController";
import { container } from "tsyringe";

const chatController = container.resolve(ChatController);
const memberController = container.resolve(MemberController);
export const initSocketServer = (io: Server) => {
  io.on("connect", async (socket) => {

    //Room 

    socket.on("join-workspace", ({ workspaceId }) => {

      socket.join(workspaceId);
    });
    //




    socket.on("UserId", async (userId) => {

      io.emit("userStatus", userId);
      await memberController.changeOnlinestatus(userId);

    });

    socket.on(`send-message`, async (msgData, worksoaceid) => {


      io.to(worksoaceid).emit("receive-message", msgData);

      await chatController.saveMessage(msgData);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });

    //create comment specify connection task or room 
    socket.on("task-join-comment", (taskId) => {
      socket.join(taskId);
    
    });

    socket.on("leave-task", (taskId) => {
      socket.leave(taskId);
    });

    socket.on("add-comment", ({ taskId, commentName, commentText, uploadedUrls }) => {
      io.to(taskId).emit("comment-notification", {
        taskId,
        commentName,
        commentText,
        uploadedUrls,
        time: new Date(),
      });
    });


  });
};
