import { Router } from "express";
import { container } from "tsyringe";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { WorkspaceController } from "../controllers/workspace/Workspacecontroller";

let adminAuth = [authMiddelware(), roleMiddleware(["Admin"])];
const router = Router();
let workspaceController = container.resolve(WorkspaceController);
// router.post("/create", (req, res, next) =>
//   workspaceController.Create(req, res, next)
// );

router.post("/create",adminAuth,workspaceController.Create.bind(workspaceController))
//  router.post("/invite", (req, res) =>
//   workspaceController.inviteMembers(req, res)
// );
// router.post("/invite", adminAuth, workspaceController.inviteadmins.bind());
router.post(
  "/invite",
  adminAuth,
  workspaceController.inviteMembers.bind(workspaceController)
);
//router.post("/invite/register",adminAuth,adminController.inviteAndRegister)
router.get("/member/data/:workspaceslug",adminAuth,workspaceController.getAllMembersData.bind(workspaceController))
// router.get("/member/data/:workspaceslug", (req, res, next) =>
//   workspaceController.getAllMembersData(req, res, next)
// );

export default router;
