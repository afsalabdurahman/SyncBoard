import { useState, useEffect } from "react";
import TicketDashboard from "../components/TicketDashboard";
import TicketDetail from "../components/TicketDetail";
import { Ticket, Message } from "../types/TiketTypes";

import {
  useCreateTicketsMutation,
  useGetTicketsQuery,
  useUpdateMsgMutation,
} from "../apis/rtqApi";

import { useUpdateTicketStatusMutation } from "../../SuperAdmin/apis/fetchApi";
import { useMember } from "../../Member/hooks/memeberhooks";

import { toast } from "react-toastify";
import { skipToken } from "@reduxjs/toolkit/query/react";

const Tickets = () => {
  const user = useMember();

  const userId = user._id;
  const workspaceId = user.workspace[0]?.workspaceId;

  const [createTicket] = useCreateTicketsMutation();
  const [updateMsg] = useUpdateMsgMutation();
  const [updateTicketStatus] = useUpdateTicketStatusMutation();

  // 🔥 AUTO-UPDATE ENABLED: Polling every 5 seconds
  // This will automatically fetch the latest data from MongoDB whenever the client (or  other admin) updates anything.
  // No page refresh needed.
  const { data: tickets = [] } = useGetTicketsQuery(workspaceId ?? skipToken, {
    pollingInterval: 5000,        // ← Change this value if you want faster/slower updates (in milliseconds)
    refetchOnFocus: true,         // Refetch when user returns to the tab
    refetchOnReconnect: true,     // Refetch when network reconnects
  });

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // 🔥 SYNC SELECTED TICKET WITH LIVE DATA
  // Whenever the tickets list updates (via polling or client changes), we automatically update the open detail view
  // so the admin always sees the latest messages/status without manual refresh.
  useEffect(() => {
    if (!selectedTicket) return;

    const updatedTicket = tickets.find(
      (t) => t.id === selectedTicket.id || t.SLno === selectedTicket.SLno
    );

    if (updatedTicket) {
      setSelectedTicket(updatedTicket);
    }
  }, [tickets,selectedTicket]);

  /* ---------------- SEND MESSAGE ---------------- */

  const handleSendMessage = async (ticketId: string, message: string) => {
    const newMessage: Message = {
      sender: "admin",
      content: message,
      timestamp: new Date(),
    };

    try {
      await updateMsg({ msg: newMessage, id: ticketId }).unwrap();

      // Instant UI feedback for the admin
      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMessage],
            }
          : prev
      );
    } catch {
      toast.error("Failed to send message");
    }
  };

  /* ---------------- REOPEN TICKET ---------------- */

  const handleReopenTicket = async (ticketId: string) => {
    try {
      await updateTicketStatus({
        ticketId,
        newStatus: "in_progress",
      }).unwrap();
    } catch {
      toast.error("Failed to reopen ticket");
    }
  };

  /* ---------------- CREATE TICKET ---------------- */

  const handleCreateTicket = async (
    newTicket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "messages">
  ) => {
    const ticket: Ticket = {
      ...newTicket,
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId,
      userId,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "admin",
          content: newTicket.description,
          timestamp: new Date(),
        },
      ],
    };

    try {
      await createTicket(ticket).unwrap();
      toast.success("Ticket created successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create ticket";

      toast.error(message);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex h-screen bg-background">
      {/* Ticket List */}
      <div
        className={`flex-1 transition-all duration-300 ${
          selectedTicket ? "lg:w-1/2" : "w-full"
        }`}
      >
        <TicketDashboard
          tickets={tickets}
          onSelectTicket={setSelectedTicket}
          selectedTicketId={selectedTicket?.SLno}
          onCreateTicket={handleCreateTicket}
        />
      </div>

      {/* Desktop Ticket Detail */}
      {selectedTicket && (
        <div className="hidden lg:block lg:w-1/2 border-l border-border">
          <TicketDetail
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onSendMessage={handleSendMessage}
            onReopenTicket={handleReopenTicket}
          />
        </div>
      )}

      {/* Mobile Ticket Detail */}
      {selectedTicket && (
        <div className="lg:hidden fixed inset-0 bg-background z-50">
          <TicketDetail
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onSendMessage={handleSendMessage}
            onReopenTicket={handleReopenTicket}
          />
        </div>
      )}
    </div>
  );
};

export default Tickets;