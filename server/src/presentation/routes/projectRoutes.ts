import express from "express"
import { container } from "tsyringe"
import {ProjectController} from "../../presentation/controllers/project/ProjectController"
import { authMiddelware } from "../middleware/authMiddleware"
import { roleMiddleware } from "../middleware/roleMiddleware"
import {subscriptionMiddle} from "../middleware/subscriptionMiddleware"
const projectController = container.resolve(ProjectController)

const router = express.Router();
const adminAuth = [authMiddelware(), roleMiddleware(["Admin","Member"])];

router.post('/create/:workspaceid',adminAuth,subscriptionMiddle("project"),projectController.createProject.bind(projectController))
router.get('/projects/:workspaceid',adminAuth,projectController.allProjects.bind(projectController))
router.delete('/remove/attachment/:projectId/:encodedUrl',adminAuth,projectController.removeAttchmentInProject.bind(projectController))
router.patch('/update/:id',adminAuth,projectController.updateProject.bind(projectController))
router.delete('/delete/:id',adminAuth,projectController.deleteProject.bind(projectController))
router.get('/myprojects/:workspaceId',adminAuth,projectController.pagination.bind(projectController))
router.patch('/delete/attachment/:projectId',adminAuth,projectController.deleteAttahedURL.bind(projectController))
router.get('/name/all/:workspaceId',adminAuth,projectController.findAllProjectsName.bind(projectController))
router.get("/mebers/names/:projectId",projectController.findProjectMemebrs.bind(projectController))

router.get("/burndown/chart/:projectId",projectController.burnDownChart.bind(projectController))

export default router;