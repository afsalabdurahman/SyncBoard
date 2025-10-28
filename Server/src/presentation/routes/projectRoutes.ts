import express from "express"
import { container } from "tsyringe"
import {ProjectController} from "../../presentation/controllers/project/ProjectController"
import { authMiddelware } from "../middleware/authMiddleware"
import { roleMiddleware } from "../middleware/roleMiddleware"
import {subscriptionMiddle} from "../middleware/subscriptionMiddleware"
let projectController = container.resolve(ProjectController)

let router = express.Router();
const adminAuth = [authMiddelware(), roleMiddleware(["Admin"]),subscriptionMiddle("project")];
const memberAuth = [authMiddelware(), roleMiddleware(["Member","Admin"])];

router.post('/create/:workspaceid',adminAuth,projectController.createProject.bind(projectController))
router.get('/projects',projectController.allProjects.bind(projectController))
router.delete('/remove/attachment/:projectId/:encodedUrl',adminAuth,projectController.removeAttchmentInProject.bind(projectController))
router.patch('/update/:id',adminAuth,projectController.updateProject.bind(projectController))
router.delete('/delete/:id',adminAuth,projectController.deleteProject.bind(projectController))
router.get('/myprojects',projectController.pagination.bind(projectController))

export default router;