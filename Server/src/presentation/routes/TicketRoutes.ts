import { Router } from "express";
import { container } from "tsyringe";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { TicketController } from "../controllers/ticket/TicketController";

let adminAuth = [authMiddelware(), roleMiddleware(["Admin"])];
let memberAuth = [authMiddelware(), roleMiddleware(["Admin", "Member"])];

const router = Router();

let ticketController = container.resolve(TicketController);

router.post("/create",ticketController.createTicket.bind(ticketController));
router.get("/mytickets/:workspaceid",ticketController.findMyTickets.bind(ticketController))
router.post("/update/message/:id",ticketController.updateTicketMsg.bind(ticketController))
export default router;