import express from "express";
import {SubscriptionController} from "../controllers/suscription/SuscriptionController"
import {container } from "tsyringe";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = express.Router();

const suscriptionController=container.resolve(SubscriptionController)
const adminAuth = [authMiddelware(), roleMiddleware(["Member", "Admin"])];

router.post("/payment/:userid",adminAuth,suscriptionController.addCheckout.bind(suscriptionController))


export default router;
