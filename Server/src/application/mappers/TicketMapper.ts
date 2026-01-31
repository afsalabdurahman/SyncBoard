import { z } from "zod";
import { TicketStatus, Message } from "../../types/tiketTypes";
import { ticketRequestDTO } from "../dto/TiketDTO";
import { Ticket } from "../../domain/entities/Ticket";
import { stringToMongoObj } from "../../utils/convertMongoObject";
import { TicketDocument } from "../../infrastructure/database/models/TicketModel";

export class TicketMapper {
  static validateTicket(input: ticketRequestDTO) {
    const isValid = z.object({
      title: z
        .string()
        .min(1, "Task name is required")
        .max(20, "Title must be at most 20 characters"),

      description: z
        .string()
        .min(1, "Description is required")
        .max(100, "Description must be at most 100 characters"),

      priority: z.enum(["low", "medium", "high", "critical"], {
        errorMap: () => ({ message: "Invalid priority value" }),
      }),

      

      status: z.enum(["open", "in_progress", "resolved", "reopened"], {
        errorMap: () => ({ message: "Invalid status value" }),
      }),

      workspaceId: z.string().min(1, "Workspace ID is required"),

      userId: z.string().min(1, "User ID is required"),

      category: z.string().min(1, "Category is required"),

      messages: z.array(
        z.object({
          id: z.string(),
          sender: z.enum(["admin", "super_admin"]),
          content: z.string(),
          timestamp: z.string(),
        })
      ),
    });

    return isValid.safeParse(input);
  }
  static ticketToEntity(input:ticketRequestDTO):Ticket{
 
return new Ticket({
  SLno:input.id,
  category:input.category,
  description:input.description,
  status:input.status,
  title:input.title,
  userId:stringToMongoObj(input.userId),
  workspaceId:stringToMongoObj(input.workspaceId),
 messages: input.messages?.map(m => ({
    id: m.id,
    sender: m.sender,
    content: m.content,
    timestamp: new Date(m.timestamp)  
  })) || [],
  priority:input.priority,

})
  }

  static mapTOTickets(tickets: TicketDocument[]): Ticket[] {
     const ticketDomain= tickets.map((ticket)=>{
      return new Ticket({_id: ticket._id?.toString(), category: ticket.category, description: ticket.description, SLno: ticket.SLno
        ,status:ticket.status,title:ticket.title,userId:ticket.userId,workspaceId:ticket.workspaceId,
        createdAt:ticket.createdAt,messages:ticket.messages,priority:ticket.priority,updatedAt:ticket.updatedAt
      })

     })
     return ticketDomain
  }
}
