import express from "express";
import { container } from "tsyringe";
import {MemberController} from "../controllers/member/MemberController"

const router = express.Router();
let memberController = container.resolve(MemberController);
router.patch("/profile/update/:id",(req,res,next)=>memberController.updateUserProfile(req,res,next))
router.patch("/change/password/:id",(req,res,next)=>memberController.changeUserPassword(req,res,next))
router.post("/invite/register",(req,res,next)=>memberController.inviteAndRegister(req,res,next))
export default router;