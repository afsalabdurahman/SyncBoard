import express from "express";
import { container } from "tsyringe";
import { MemberController } from "../controllers/member/MemberController";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
 
const router = express.Router();

const memberAuth = [authMiddelware(), roleMiddleware(["Member", "Admin","SuperAdmin"])];
const memberController = container.resolve(MemberController);

router.patch("/profile/update/:id", memberAuth, memberController.updateUserProfile.bind(memberController))
router.patch("/change/password/:id", memberAuth,memberController.changeUserPassword.bind(memberController));
router.post("/invite/register",memberController.inviteAndRegister.bind(memberController))
router.get("/find/user/:email",memberController.findUserByEmail.bind(memberController))
router.post("/reset/password/:id",memberController.resetPassword.bind(memberController))
// router.get("/find/user/exist/:email",memberController.)
export default router;
