import { injectable,container } from "tsyringe";

import express from "express";

import {SuperController} from "../controllers/super/SuperController"
import { roleMiddleware } from "../middleware/roleMiddleware";
import { authMiddelware } from "../middleware/authMiddleware";
let memberAuth = [authMiddelware(), roleMiddleware(["SuperAdmin"])];
let superController=container.resolve(SuperController);
let router = express.Router();
router.get("/counts",memberAuth,superController.totalCount.bind(superController))
 router.get('/count/workspace',superController.totalWorkspaceCount.bind(superController))
router.get("/count/users",superController.totalUsersCount.bind(superController))
router.get("/user/details/:id",superController.fetchAUser.bind(superController)) 
router.get("/count/subscription",superController.fetchSubscription.bind(superController))
export default router;