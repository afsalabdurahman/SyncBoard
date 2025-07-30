import express from "express"
import { container } from "tsyringe"
import {TaskController} from "../../presentation/controllers/task/TaskController"
import { authMiddelware } from "../middleware/authMiddleware"
import { roleMiddleware } from "../middleware/roleMiddleware"


const taskController = container.resolve(TaskController)

let router = express.Router();
const adminAuth = [authMiddelware(), roleMiddleware(["Admin"])];
const memberAuth = [authMiddelware(), roleMiddleware(["Member","Admin"])];
router.post('/create',adminAuth,taskController.createTask.bind(taskController))
router.get('/alltasks',memberAuth,taskController.allTasks.bind(taskController))
router.patch('/update/:id',adminAuth,taskController.updateTask.bind(taskController))
router.delete('/delete/:id',adminAuth,taskController.deleteTask.bind(taskController))
router.get("/mytask/:username",memberAuth,taskController.findMyTask.bind(taskController))
export default router;