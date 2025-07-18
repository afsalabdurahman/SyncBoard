import { Router } from "express";
import { container } from "tsyringe";
import { WorkspaceController } from "../controllers/workspace/Workspacecontroller";
const router = Router();
let workspaceController = container.resolve(WorkspaceController);
router.post("/create", (req, res, next) =>
  workspaceController.Create(req, res, next)
);
router.post("/invite", (req, res) =>
  workspaceController.inviteMembers(req, res)
);
router.get("/member/data/:workspaceslug",(req,res,next)=>workspaceController.getAllMembersData(req,res,next))

export default router;
