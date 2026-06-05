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
router.post("/invite/:workspaceId",adminAuth,workspaceController.inviteMembers.bind(workspaceController));
router.get("/member/data/:workspaceslug",memberAuth,workspaceController.getAllMembersData.bind(workspaceController));
router.get("/member/pagination/data/:workspaceslug",memberAuth,workspaceController.pagination.bind(workspaceController))
router.patch("/update/:id",superAuh, workspaceController.updateWorkspace.bind(workspaceController))
router.post("/abuse/:id/:workspaceId",memberAuth,workspaceController.abuseReport.bind(workspaceController))
router.get("/abuse/reports",memberAuth,workspaceController.finAbuseReports.bind(workspaceController))
 router.get("/abuse/list/:workspaceId/:userid",memberAuth,workspaceController.listOfAbuseReports.bind(workspaceController))
router.post("/abuse/report/status/:id",memberAuth,workspaceController.updateStatus.bind(workspaceController))
router.get("/abuse/report/search/:workspaceId/:userid",memberAuth,workspaceController.searchReports.bind(workspaceController))
router.get('/download/workspace',adminAuth,workspaceController.downloadWorkerData.bind(workspaceController))
router.get("/members/find/:slug",memberAuth,workspaceController.findUser.bind(workspaceController))
router.get("/lists/:id",workspaceController.listWorkspaces.bind(workspaceController))
router.get("/find/:workspaceId",memberAuth,workspaceController.findWorkspace.bind(workspaceController))
router.post("/update/permission/:workspaceId",workspaceController.updatePermission.bind(workspaceController))
router.post("/find/permission/:workspaceId",workspaceController.findPermission.bind(workspaceController))
router.post("/invitation/exisit/user",workspaceController.invitationForExistingUser.bind(workspaceController))
router.post("/invitation/status/update",workspaceController.invitationRejected.bind(workspaceController))
router.post("/update/member/profile/:userId/:workspaceId",workspaceController.updateUserInWorkspace.bind(workspaceController))
export default router;
