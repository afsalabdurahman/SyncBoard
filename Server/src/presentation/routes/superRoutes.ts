import { injectable,container } from "tsyringe";

import express from "express";

import {SuperController} from "../controllers/super/SuperController"

let superController=container.resolve(SuperController);
let router = express.Router();
router.get("/counts",superController.totalCount.bind(superController))

export default router;