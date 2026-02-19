import express from "express"
import { container } from "tsyringe"
import { RagController } from "../controllers/rag/RagController"
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

let router = express.Router();

const ragController = container.resolve(RagController)
let allRoleAuth = [authMiddelware(), roleMiddleware(["Member", "Admin", "SuperAdmin"])];

router.post("/search", allRoleAuth, ragController.search.bind(ragController))

export default router;