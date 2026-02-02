import { container } from "tsyringe";
import express from "express";
import {SubscriptionController} from "../controllers/suscription/SuscriptionController"
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const adminAuth = [authMiddelware(), roleMiddleware(["Admin"])];

let suscriptionController = container.resolve(SubscriptionController)
let router = express.Router();

router.get("/mysubscription/:userid",adminAuth,suscriptionController.getSuscription.bind(suscriptionController))


export default router;