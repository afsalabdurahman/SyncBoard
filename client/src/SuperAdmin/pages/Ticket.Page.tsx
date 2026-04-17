import { useState,useEffect } from "react";
import { Ticket, TicketStatus, Message } from "./TicketIndex";
import { Input } from "../../Custom/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../Custom/ui/tabs";
import { Search, Shield,  } from "lucide-react";
import { Dialog, DialogContent } from "../../Custom/ui/dialog";
import TicketCard from "../components/tickets/TicketCard";
import SuperAdminTicketDetail from "../components/tickets/SuperAdminTicketDetail";
import { useFetchAllTicketsPageQuery, useUpdateTicketStatusMutation } from "../apis/fetchApi";
import { useUpdateMsgMutation } from "../../Admin/apis/rtqApi";
import { toast } from "react-toastify";
// Mock data for super admin view - would come from backend
// const mockTickets: Ticket[] = [
//   {
//     id: "TKT-001",
//     title: "Unable to access dashboard",
//     description: "After login, the dashboard shows a blank screen. I've tried refreshing multiple times.",
//     status: "open",
//     priority: "high",
//     workspace: "Engineering Team",
//     company: "TechCorp Inc",
//     createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
//     updatedAt: new Date(Date.now() - 30 * 60 * 1000),
//     messages: [
//       {
//         id: "msg-1",
//         content: "After login, the dashboard shows a blank screen. I've tried refreshing multiple times.",
//         sender: "admin",
//         timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
//       },
//     ],
//   },
//   {
//     id: "TKT-002",
//     title: "Billing discrepancy",
//     description: "My invoice shows incorrect charges for last month's usage.",
//     status: "in_progress",
//     priority: "medium",
//     workspace: "Finance",
//     company: "StartupXYZ",
//     createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
//     updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
//     messages: [
//       {
//         id: "msg-2",
//         content: "My invoice shows incorrect charges for last month's usage.",
//         sender: "admin",
//         timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
//       },
//       {
//         id: "msg-3",
//         content: "I'm looking into this issue. Could you provide your invoice number?",
//         sender: "super_admin",
//         timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
//       },
//       {
//         id: "msg-4",
//         content: "Invoice number is INV-2024-0123",
//         sender: "admin",
//         timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
//       },
//     ],
//   },
//   {
//     id: "TKT-003",
//     title: "API rate limit too restrictive",
//     description: "Current API rate limit is preventing our integration from working properly.",
//     status: "resolved",
//     priority: "low",
//     workspace: "Development",
//     company: "DataCo",
//     createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
//     updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
//     messages: [
//       {
//         id: "msg-5",
//         content: "Current API rate limit is preventing our integration from working properly.",
//         sender: "admin",
//         timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
//       },
//       {
//         id: "msg-6",
//         content: "I've increased your rate limit. Please check if this resolves the issue.",
//         sender: "super_admin",
//         timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
//       },
//     ],
//   },
// ];



export const TicketPage = () => {




  const [updateTicketStatus] = useUpdateTicketStatusMutation()
    const [updateMsg] = useUpdateMsgMutation()
    const [sidebarCollapsed] = useState(false)
    //  const {
    //    data: tickets = [],
    //    refetch,
       
    //  } = useFetchAllTicketsPageQuery({
    //   refetchOnFocus: true,
    //  });
   
     const {
  data: tickets = [],
  refetch,
} = useFetchAllTicketsPageQuery(
  {},
  {
    refetchOnFocus: true,
    pollingInterval: 15000,    
    // pollingInterval: 10000, 
  }
);
  useEffect(()=>{
refetch()
     },[])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");


  const filteredTickets = tickets.filter((ticket) => {

    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.SLno.toLowerCase().includes(searchQuery.toLowerCase()) 
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: TicketStatus | "all") => {
    if (status === "all") return tickets.length;
    return tickets.filter((t) => t.status === status).length;
  };

  const handleSendMessage = async (ticketId: string, message: string) => {
      const newMessage: Message = {
                sender: "super_admin",
                content: message,
                timestamp: new Date(),
              };
              try {
                await await updateMsg({msg:newMessage,id:ticketId});
                  setSelectedTicket(prev =>
  prev
    ? { 
        ...prev, 
        messages: [...prev.messages, newMessage] 
      }
    : prev
);
refetch()
              } catch  {
                toast.error("Send failed")
              }
  };

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      await updateTicketStatus({ticketId,newStatus})
   refetch()
      toast.success("Updated")
    } catch  {
      toast.error("Failed to update")
    }
    // setTickets((prevTickets) =>
    //   prevTickets.map((ticket) => {
    //     if (ticket.id === ticketId) {
    //       const updatedTicket = {
    //         ...ticket,
    //         status: newStatus,
    //         updatedAt: new Date(),
    //       };

    //       if (selectedTicket?.id === ticketId) {
    //         setSelectedTicket(updatedTicket);
    //       }

    //       return updatedTicket;
    //     }
    //     return ticket;
    //   })
    // );
  };
useEffect(()=>{

},[])
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Super Admin Portal</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage all support tickets</p>
              </div>
            </div>
          
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6">
        {/* Search & Filters */}
        <div className="space-y-4 mb-6">
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

          <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | "all")}>
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-5 gap-1">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                All <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">{getStatusCount("all")}</span>
              </TabsTrigger>
              <TabsTrigger value="open" className="text-xs sm:text-sm">
                Open <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">{getStatusCount("open")}</span>
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="text-xs sm:text-sm">
                Progress <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">{getStatusCount("in_progress")}</span>
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs sm:text-sm">
                Resolved <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">{getStatusCount("resolved")}</span>
              </TabsTrigger>
              <TabsTrigger value="reopened" className="text-xs sm:text-sm col-span-2 sm:col-span-1">
                Reopened <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">{getStatusCount("reopened")}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTickets.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tickets found</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                onClick={() => setSelectedTicket(ticket)}
                isSelected={selectedTicket?.id === ticket._id}
              />
            ))
          )}
        </div>
      </div>
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
      {/* Ticket Detail Modal */}
         <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 gap-0 overflow-hidden flex flex-col">

          {selectedTicket && (

            <SuperAdminTicketDetail

              ticket={selectedTicket}

              onSendMessage={handleSendMessage}

              onStatusChange={handleStatusChange}

              onClose={() => setSelectedTicket(null)}

            />

          )}

        </DialogContent>

      </Dialog>
    </main>
    </div>
  );
};

