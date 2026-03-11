import { useState } from "react";
import { Ticket, TicketDashboardProps, TicketStatus } from "../types/TiketTypes";
import { Button } from "../../Custom/ui/button";
import { Input } from "../../Custom/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../Custom/ui/tabs";
import { Plus, Search } from "lucide-react";
import TicketCard from "./TicketCard";
import CreateTicketDialog from "./CreateTicketDialog";



const TicketDashboard = ({ tickets, onSelectTicket, selectedTicketId, onCreateTicket }: TicketDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.SLno.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: TicketStatus | "all") => {
    if (status === "all") return tickets.length;
    return tickets.filter((t) => t.status === status).length;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
              <p className="text-muted-foreground mt-1">Manage and track your support requests</p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="px-6 pb-4">
          <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | "all")}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all" className="gap-2">
                All <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{getStatusCount("all")}</span>
              </TabsTrigger>
              <TabsTrigger value="open" className="gap-2">
                Open <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{getStatusCount("open")}</span>
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="gap-2">
                In Progress <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{getStatusCount("in_progress")}</span>
              </TabsTrigger>
              <TabsTrigger value="resolved" className="gap-2">
                Resolved <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{getStatusCount("resolved")}</span>
              </TabsTrigger>
              <TabsTrigger value="reopened" className="gap-2">
                Reopened <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{getStatusCount("reopened")}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tickets found</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.SLno}
                ticket={ticket}
                onClick={() => onSelectTicket(ticket)}
                isSelected={selectedTicketId === ticket.SLno}
              />
            ))
          )}
        </div>
      </div>

      <CreateTicketDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTicket={onCreateTicket}
      />
    </div>
  );
};

export default TicketDashboard;
