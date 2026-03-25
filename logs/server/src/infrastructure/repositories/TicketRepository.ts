import { Types } from "mongoose";
import { Ticket } from "../../domain/entities/Ticket";
import { ITicketRepository } from "../../domain/interfaces/repositories/ITicketRepository";
import { TicketDocument, TicketModel } from "../database/models/TicketModel";
import { BaseRepository } from "./BaseRepository";
import { Message } from "../../types/tiketTypes";
import { TaskModel } from "../database/models/TaskModel";

export class TicketRepository extends BaseRepository<Ticket> implements ITicketRepository {
    constructor() {
        super(TicketModel)
    }
    async getMyTickets(workspaceId: Types.ObjectId): Promise<TicketDocument[] | null > {
        const tickets = await TicketModel.find({ workspaceId }).lean().exec()
        if(!tickets) return null
        return tickets 
    }

  async updateMsg(ticketId: Types.ObjectId, msg: Message): Promise<void> {
          
  await TicketModel.findByIdAndUpdate(
    ticketId,
    { $push: { messages: msg } },
    { new: true}
  );
}
async updateTicketStatus(ticketId: Types.ObjectId, status: "open" | "in_progress" | "resolved" | "reopened"): Promise<void> {

  const result=await  TicketModel.findByIdAndUpdate(ticketId,{status:status},{new:true})

}

}