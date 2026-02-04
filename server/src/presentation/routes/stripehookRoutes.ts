import express from "express";
import {raw} from "express"
import {SubscriptionController} from "../controllers/suscription/SuscriptionController"
import {container } from "tsyringe";


const router = express.Router();

const subscriptionController=container.resolve(SubscriptionController)

router.use("/pay/webhook",raw({type:"application/json"}))
router.post("/pay/webhook", 
  subscriptionController.webHookNotify.bind(subscriptionController)
);
export default router;
