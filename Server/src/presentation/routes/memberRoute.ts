import express from "express";
import { container } from "tsyringe";
import { MemberController } from "../controllers/member/MemberController";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
const router = express.Router();
let memberAuth = [authMiddelware(), roleMiddleware(["Member", "Admin"])];
let memberController = container.resolve(MemberController);

router.patch("/profile/update/:id",memberAuth,memberController.updateUserProfile.bind(memberController))
router.patch("/change/password/:id", (req, res, next) =>
  memberController.changeUserPassword(req, res, next)
);
router.post("/invite/register", (req, res, next) =>
  memberController.inviteAndRegister(req, res, next)
);
export default router;
