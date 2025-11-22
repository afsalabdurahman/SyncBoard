import express from "express"
import { container } from "tsyringe"
import {RagController} from "../controllers/rag/RagController"
let router = express.Router();
const ragController = container.resolve(RagController)
router.post("/search",ragController.search.bind(ragController))

export default router;