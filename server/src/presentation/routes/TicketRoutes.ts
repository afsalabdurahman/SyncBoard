import { Router } from "express";
import { container } from "tsyringe";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { TicketController } from "../controllers/ticket/TicketController";

const router = Router();

const adminAuth = [authMiddelware(), roleMiddleware(["Admin"])];
const superAuth = [authMiddelware(), roleMiddleware(["Admin", "SuperAdmin"])];

const ticketController = container.resolve(TicketController);

router.post("/create",adminAuth,ticketController.createTicket.bind(ticketController));
router.get("/mytickets/:workspaceid",adminAuth,ticketController.findMyTickets.bind(ticketController))
router.post("/update/message/:id",superAuth,ticketController.updateTicketMsg.bind(ticketController))
router.patch("/update/status/:id",superAuth,ticketController.updateTicketStatus.bind(ticketController))

export default router;