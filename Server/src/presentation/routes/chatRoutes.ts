import express from "express";
import { Router } from "express";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import {ChatController} from "../controllers/chat/ChatController"
import { container, registry } from "tsyringe";

const route=Router()
const memberAuth=[authMiddelware(),roleMiddleware(["Member","Admin"])]
const chatController=container.resolve(ChatController)
route.get("/history",memberAuth,chatController.chatHistor.bind(chatController))


export default route