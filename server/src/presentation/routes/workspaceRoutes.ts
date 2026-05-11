import { Router } from "express";
import { container } from "tsyringe";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { WorkspaceController } from "../controllers/workspace/Workspacecontroller";

const router = Router();

const adminAuth = [authMiddelware(), roleMiddleware(["Admin","SuperAdmin"])];
const memberAuth = [authMiddelware(), roleMiddleware(["Admin", "Member","SuperAdmin"])];
const superAuh =[authMiddelware(),roleMiddleware(["SuperAdmin"])]
const workspaceController = container.resolve(WorkspaceController);

router.post("/create",workspaceController.Create.bind(workspaceController));
router.post("/invite",adminAuth,workspaceController.inviteMembers.bind(workspaceController));
router.get("/member/data/:workspaceslug",memberAuth,workspaceController.getAllMembersData.bind(workspaceController));
router.get("/member/pagination/data/:workspaceslug",memberAuth,workspaceController.pagination.bind(workspaceController))
router.patch("/update/:id",superAuh, workspaceController.updateWorkspace.bind(workspaceController))
router.post("/abuse/:id/:workspaceid",memberAuth,workspaceController.abuseReport.bind(workspaceController))
router.get("/abuse/reports",memberAuth,workspaceController.finAbuseReports.bind(workspaceController))
 router.get("/abuse/list/:workspaceid/:userid",memberAuth,workspaceController.listOfAbuseReports.bind(workspaceController))
router.post("/abuse/report/status/:id",memberAuth,workspaceController.updateStatus.bind(workspaceController))
router.get("/abuse/report/search/:workspaceid/:userid",memberAuth,workspaceController.searchReports.bind(workspaceController))
router.get('/download/workspace',adminAuth,workspaceController.downloadWorkerData.bind(workspaceController))
router.get("/members/find/:slug",memberAuth,workspaceController.findUser.bind(workspaceController))
router.get("/lists/:id",workspaceController.listWorkspaces.bind(workspaceController))
export default router;
