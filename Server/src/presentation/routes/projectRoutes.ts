import express from "express"
import { container } from "tsyringe"
import {ProjectController} from "../../presentation/controllers/project/ProjectController"
import { authMiddelware } from "../middleware/authMiddleware"
import { roleMiddleware } from "../middleware/roleMiddleware"

let projectController = container.resolve(ProjectController)

let router = express.Router();
const adminAuth = [authMiddelware(), roleMiddleware(["Admin"])];
const memberAuth = [authMiddelware(), roleMiddleware(["Member","Admin"])];

router.post('/create',adminAuth,projectController.createProject.bind(projectController))
router.get('/projects',memberAuth,projectController.allProjects.bind(projectController))
router.delete('/remove/attachment/:projectId/:encodedUrl',adminAuth,projectController.removeAttchmentInProject.bind(projectController))
router.patch('/update/:id',adminAuth,projectController.updateProject.bind(projectController))
router.delete('/delete/:id',adminAuth,projectController.deleteProject.bind(projectController))
export default router;