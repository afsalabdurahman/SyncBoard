import { injectable,container } from "tsyringe";
import bodyParser from "body-parser";
import express from "express";
import { Request, Response } from "express";
import {SubscriptionController} from "../controllers/suscription/SuscriptionController"
let suscriptionController = container.resolve(SubscriptionController)

let router = express.Router();
router.get("/mysubscription/:userid",suscriptionController.getSuscription.bind(suscriptionController))


export default router;