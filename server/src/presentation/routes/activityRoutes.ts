import express from "express";
import { ActivityController } from "../controllers/activity/ActivityController";
import { container } from "tsyringe";
const activityController = container.resolve(ActivityController)
const router = express.Router();


router.get("/logs/:id",activityController.myLogs.bind(activityController))
export default router;
