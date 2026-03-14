import { container } from "tsyringe";
import express from "express";
import {SubscriptionController} from "../controllers/suscription/SuscriptionController"
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const adminAuth = [authMiddelware(), roleMiddleware(["Admin"])];

const subscriptionController = container.resolve(SubscriptionController)
const router = express.Router();

router.get("/mysubscription/:userid",adminAuth,subscriptionController.getSuscription.bind(subscriptionController))
router.get("/active/plans",adminAuth,subscriptionController.getActivePlans.bind(subscriptionController))

export default router;