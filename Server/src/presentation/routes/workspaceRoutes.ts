import { Router } from "express";
import { container } from "tsyringe";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { WorkspaceController } from "../controllers/workspace/Workspacecontroller";

let memberAuth = [authMiddelware(), roleMiddleware(["Admin","Member"])];
const router = Router();
let workspaceController = container.resolve(WorkspaceController);
router.post("/create", (req, res, next) =>
  workspaceController.Create(req, res, next)
);
//  router.post("/invite", (req, res) =>
//   workspaceController.inviteMembers(req, res)
// );
// router.post("/invite", memberAuth, workspaceController.inviteMembers.bind());
router.post(
  "/invite",
  memberAuth,
  workspaceController.inviteMembers.bind(workspaceController)
);
//router.post("/invite/register",memberAuth,memberController.inviteAndRegister)
router.get("/member/data/:workspaceslug",memberAuth,workspaceController.getAllMembersData.bind(workspaceController))
// router.get("/member/data/:workspaceslug", (req, res, next) =>
//   workspaceController.getAllMembersData(req, res, next)
// );

export default router;
