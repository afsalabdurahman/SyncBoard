import express from "express";
import { ActivityController } from "../controllers/activity/ActivityController";
import { container } from "tsyringe";
const activityController=container.resolve(ActivityController)
const router = express.Router();


router.post("/create",(req,res,next)=>activityController.createActivity(req,res,next))
router.get("/all",(req,res,next)=>activityController.allActivity(req,res,next))

export default router;
