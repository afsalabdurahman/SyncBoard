
import { Router } from "express";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { ChatController } from "../controllers/chat/ChatController";
import { container, } from "tsyringe";

const route = Router();
const memberAuth = [authMiddelware(), roleMiddleware(["Member", "Admin"])];
const chatController = container.resolve(ChatController);

route.get("/history/:workspaceId", memberAuth, chatController.chatHistory.bind(chatController));
route.get("/online/:workspaceId", memberAuth, chatController.findOnlineStatus.bind(chatController));

export default route;
