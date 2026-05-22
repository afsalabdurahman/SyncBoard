import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "../../Custom/ui/button";
import TicketDashboard from "../components/tickets/TicketDashboard";
import TicketDetail from "../components/tickets/TicketDetail";

export type TicketStatus = "open" | "in_progress" | "resolved" | "reopened";

export interface Message {
  id?: string;
  sender: "admin" | "super_admin";
  content: string;
  timestamp: Date;
}

// export interface Ticket {
//   _id: string;
//   title: string;
//   description: string;
//   status: TicketStatus;
//   priority: "low" | "medium" | "high" | "critical";
//   workspace: string;
//   company: string;
//   createdAt: Date;
//   updatedAt: Date;
//   messages: Message[];
// }

export const TicketIndex = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Mock data
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TKT-001",
      title: "Unable to access workspace settings",
      description: "When I try to access the workspace settings page, I get a 403 error. This is blocking our team from updating permissions.",
      status: "open",
      priority: "high",
      workspace: "Engineering Team",
      company: "TechCorp Inc.",
      createdAt: new Date("2024-01-15T10:30:00"),
      updatedAt: new Date("2024-01-15T10:30:00"),
      messages: [
        {
          id: "msg-1",
          sender: "admin",
          content: "Unable to access workspace settings. Getting 403 error.",
          timestamp: new Date("2024-01-15T10:30:00"),
        },
      ],
    },
    {
      id: "TKT-002",
      title: "Billing invoice not generated",
      description: "The monthly billing invoice for December hasn't been generated yet. Need this urgently for accounting.",
      status: "in_progress",
      priority: "medium",
      workspace: "Finance",
      company: "TechCorp Inc.",
      createdAt: new Date("2024-01-14T14:20:00"),
      updatedAt: new Date("2024-01-15T09:15:00"),
      messages: [
        {
          id: "msg-2",
          sender: "admin",
          content: "December invoice is missing. Need it ASAP for accounting.",
          timestamp: new Date("2024-01-14T14:20:00"),
        },
        {
          id: "msg-3",
          sender: "super_admin",
          content: "Looking into this. Checking the billing system logs now.",
          timestamp: new Date("2024-01-15T09:15:00"),
        },
      ],
    },
    {
      id: "TKT-003",
      title: "API rate limit issues",
      description: "We're experiencing frequent rate limit errors on the API endpoint /api/v1/users even though we're within our plan limits.",
      status: "resolved",
      priority: "critical",
      workspace: "Development",
      company: "StartupXYZ",
      createdAt: new Date("2024-01-13T08:00:00"),
      updatedAt: new Date("2024-01-14T16:30:00"),
      messages: [
        {
          id: "msg-4",
          sender: "admin",
          content: "Getting rate limited on /api/v1/users endpoint. We're within our limits.",
          timestamp: new Date("2024-01-13T08:00:00"),
        },
        {
          id: "msg-5",
          sender: "super_admin",
          content: "Found the issue - there was a misconfiguration in the rate limiter. Fixed now.",
          timestamp: new Date("2024-01-14T15:00:00"),
        },
        {
          id: "msg-6",
          sender: "super_admin",
          content: "Your issue has been resolved. Can you please verify that everything is working correctly now?",
          timestamp: new Date("2024-01-14T16:30:00"),
        },
      ],
    },
  ]);

  const handleSendMessage = (ticketId: string, message: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const newMessage: Message = {
            id: `msg-${Date.now()}`,
            sender: "admin",
            content: message,
            timestamp: new Date(),
          };
          
          const updatedTicket = {
            ...ticket,
            messages: [...ticket.messages, newMessage],
            updatedAt: new Date(),
          };

          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updatedTicket);
          }

          return updatedTicket;
        }
        return ticket;
      })
    );
  };

  const handleReopenTicket = (ticketId: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const updatedTicket = {
            ...ticket,
            status: "reopened" as TicketStatus,
            updatedAt: new Date(),
          };

          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updatedTicket);
          }

          return updatedTicket;
        }
        return ticket;
      })
    );
  };

  const handleCreateTicket = (newTicket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "messages">) => {
    const ticket: Ticket = {
      ...newTicket,
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "admin",
          content: newTicket.description,
          timestamp: new Date(),
        },
      ],
    };

    setTickets([ticket, ...tickets]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">Submit and track support tickets</p>
            </div>
            <Link to="/super-admin">
              <Button variant="outline" size="sm" className="gap-2">
                <Shield className="w-4 h-4" />
                Super Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] bg-background">
        <div className={`flex-1 transition-all duration-300 ${selectedTicket ? "lg:w-1/2" : "w-full"}`}>
          <TicketDashboard
            tickets={tickets}
            onSelectTicket={setSelectedTicket}
            selectedTicketId={selectedTicket?.id}
            onCreateTicket={handleCreateTicket}
          />
        </div>
        
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

        {/* Mobile ticket detail */}
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
    </div>
  );
};


