import { injectable,container } from "tsyringe";

import express from "express";

import {SuperController} from "../controllers/super/SuperController"
import { roleMiddleware } from "../middleware/roleMiddleware";
import { authMiddelware } from "../middleware/authMiddleware";

let superAuth = [authMiddelware(), roleMiddleware(["SuperAdmin"])];
let superController=container.resolve(SuperController);
let router = express.Router();

router.get("/counts",superAuth,superController.totalCount.bind(superController))
router.get('/count/workspace',superAuth,superController.totalWorkspaceCount.bind(superController))
router.get("/count/users",superAuth,superController.totalUsersCount.bind(superController))
router.get("/user/details/:id",superAuth,superController.fetchAUser.bind(superController)) 
router.get("/count/subscription",superAuth,superController.fetchSubscription.bind(superController))
router.get("/tickets",superAuth,superController.fetchTickets.bind(superController))

export default router;