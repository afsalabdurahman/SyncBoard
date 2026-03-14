import { injectable,container } from "tsyringe";

import express from "express";

import {SuperController} from "../controllers/super/SuperController"
import { roleMiddleware } from "../middleware/roleMiddleware";
import { authMiddelware } from "../middleware/authMiddleware";

const superAuth = [authMiddelware(), roleMiddleware(["SuperAdmin"])];
const superController=container.resolve(SuperController);
const router = express.Router();

router.get("/counts",superAuth,superController.totalCount.bind(superController))
router.get('/count/workspace',superAuth,superController.totalWorkspaceCount.bind(superController))
router.get("/count/users",superAuth,superController.totalUsersCount.bind(superController))
router.get("/user/details/:id",superAuth,superController.fetchAUser.bind(superController)) 
router.get("/count/subscription",superAuth,superController.fetchSubscription.bind(superController))
router.get("/tickets",superAuth,superController.fetchTickets.bind(superController))
router.get("/plans",superAuth,superController.fetchAllPlans.bind(superController))
router.post("/create/plan",superAuth,superController.createNewPlan.bind(superController))
router.post("/update/plan/:id",superAuth,superController.updatePlan.bind(superController))
router.patch("/plan/remove/:id",superAuth,superController.removePlan.bind(superController))
router.delete("/plan/delete/:id",superAuth,superController.deletePlan.bind(superController))
export default router;