import { Types } from "mongoose";
import { Ticket } from "../../domain/entities/Ticket";
import { ITicketRepository } from "../../domain/interfaces/repositories/ITicketRepository";
import { TicketModel } from "../database/models/TicketModel";
import { BaseRepository } from "./BaseRepository";
import { Message } from "../../types/tiketTypes";

export class TicketRepository extends BaseRepository<Ticket> implements ITicketRepository {
    constructor() {
        super(TicketModel)
    }
    async getMyTickets(workspaceId: Types.ObjectId): Promise<Ticket[]> {
        const tickets = await TicketModel.find({ workspaceId }).lean()
        console.log(tickets, "tiket Get")
        return tickets as unknown as Ticket[];
    }

  async updateMsg(ticketId: Types.ObjectId, msg: Message): Promise<void> {
           console.log(ticketId,msg)
  await TicketModel.findByIdAndUpdate(
    ticketId,
    { $push: { messages: msg } },
    { new: true}
  );
}

}