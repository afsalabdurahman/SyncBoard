import { Router } from "express";
import { container } from "tsyringe";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { WorkspaceController } from "../controllers/workspace/Workspacecontroller";

const router = Router();

let adminAuth = [authMiddelware(), roleMiddleware(["Admin"])];
let memberAuth = [authMiddelware(), roleMiddleware(["Admin", "Member","SuperAdmin"])];

let workspaceController = container.resolve(WorkspaceController);

router.post("/create",adminAuth,workspaceController.Create.bind(workspaceController));
router.post("/invite",adminAuth,workspaceController.inviteMembers.bind(workspaceController));
router.get("/member/data/:workspaceslug",memberAuth,workspaceController.getAllMembersData.bind(workspaceController));
router.get("/member/pagination/data/:workspaceslug",memberAuth,workspaceController.pagination.bind(workspaceController))
router.patch("/update/:id",memberAuth, workspaceController.updateWorkspace.bind(workspaceController))
router.post("/abuse/:id/:workspaceid",memberAuth,workspaceController.abuseReport.bind(workspaceController))
router.get("/abuse/reports",memberAuth,workspaceController.finAbuseReports.bind(workspaceController))
router.post("/abuse/report/status/:id",memberAuth,workspaceController.updateStatus.bind(workspaceController))

export default router;
