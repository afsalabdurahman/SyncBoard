import express from "express";
import { container } from "tsyringe";
import { MemberController } from "../controllers/member/MemberController";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = express.Router();

let memberAuth = [authMiddelware(), roleMiddleware(["Member", "Admin","SuperAdmin"])];
let memberController = container.resolve(MemberController);

router.patch("/profile/update/:id", memberAuth, memberController.updateUserProfile.bind(memberController))
router.patch("/change/password/:id", memberAuth,memberController.changeUserPassword.bind(memberController));
router.post("/invite/register",memberController.inviteAndRegister.bind(memberController))

export default router;
