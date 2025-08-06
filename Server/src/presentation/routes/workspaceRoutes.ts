import { Router } from "express";
import { container } from "tsyringe";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { WorkspaceController } from "../controllers/workspace/Workspacecontroller";

let adminAuth = [authMiddelware(), roleMiddleware(["Admin"])];
let memberAuth = [authMiddelware(), roleMiddleware(["Admin", "Member"])];
const router = Router();
let workspaceController = container.resolve(WorkspaceController);

router.post(
  "/create",
  adminAuth,
  workspaceController.Create.bind(workspaceController)
);

router.post(
  "/invite",
  adminAuth,
  workspaceController.inviteMembers.bind(workspaceController)
);

router.get(
  "/member/data/:workspaceslug",
  memberAuth,
  workspaceController.getAllMembersData.bind(workspaceController)
);

export default router;
