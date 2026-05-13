import express from "express"
import { container } from "tsyringe"
import { TaskController } from "../../presentation/controllers/task/TaskController"
import { authMiddelware } from "../middleware/authMiddleware"
import { roleMiddleware } from "../middleware/roleMiddleware"


const taskController = container.resolve(TaskController)

const router = express.Router();

const adminAuth = [authMiddelware(), roleMiddleware(["Admin"])];
const memberAuth = [authMiddelware(), roleMiddleware(["Member", "Admin"])];

router.post('/create', adminAuth, taskController.createTask.bind(taskController))
router.get('/alltasks', memberAuth, taskController.allTasks.bind(taskController))
router.patch('/update/:id', adminAuth, taskController.updateTask.bind(taskController))
router.delete('/delete/:id', adminAuth, taskController.deleteTask.bind(taskController))
router.get("/mytask/:username", taskController.findMyTask.bind(taskController))
router.patch("/status/:id", memberAuth, taskController.updateTaskStatus.bind(taskController))
router.get("/completed/:workspaceid", taskController.findAllCompletedTasks.bind(taskController))
router.patch("/update/approval/status/:id", adminAuth, taskController.controllApprovalSatatus.bind(taskController))
router.get("/project/:projectId", memberAuth, taskController.findTaskByProject.bind(taskController))
router.get('/mytasks/:workspaceid', taskController.pagination.bind(taskController))
router.post('/send/comment/:id', taskController.addComment.bind(taskController))
router.get('/comments/:id', taskController.getCommentsById.bind(taskController))
router.patch('/attachment/delete/:taskid', taskController.deleteAttachment.bind(taskController))
router.patch('/delete/subtask/:taskid', taskController.deleteSubTask.bind(taskController))
router.patch("/update/subtask/status/:taskid", taskController.updateSubtask.bind(taskController))
router.patch("/update/approval/criteria/status/:taskid", taskController.updateApprovalCriteria.bind(taskController))
router.get("/count/dashboard/:projectid", taskController.dashBoardSpecifyTask.bind(taskController))
router.get("/count/dashboard/donet/:projectid", taskController.donetChartData.bind(taskController))
router.get("/project/list/:projectid", taskController.taskChart.bind(taskController))
router.get("/project/approval/:projectid", taskController.ApprovalStatus.bind(taskController))
router.get("/details/:taskid", taskController.taskDetailsById.bind(taskController))
router.get("/mytask/kanban/:workspaceId",taskController.findMytaskByworkspace.bind(taskController))
export default router;