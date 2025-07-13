import { Router } from "express";
import { container } from "tsyringe";
import { WorkspaceController } from "../controllers/workspace/Workspacecontroller";
const router = Router();
let workspaceController = container.resolve(WorkspaceController);
router.post("/create", (req, res) => workspaceController.Create(req, res));
router.post("/invite",(req,res)=>workspaceController.inviteMembers(req , res))

export default router;
