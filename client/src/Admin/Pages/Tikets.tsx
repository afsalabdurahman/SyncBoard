import { useState } from "react";
import TicketDashboard from "../components/TicketDashboard";
import TicketDetail from "../components/TicketDetail";
import {Ticket,Message,TicketStatus} from "../types/TiketTypes"
import { useCreateTicketsMutation, useGetTicketsQuery,useUpdateMsgMutation } from "../apis/rtqApi";
import { toast } from "react-toastify";
import { useMember } from "../../Member/hooks/memeberhooks";
import { skipToken } from "@reduxjs/toolkit/query/react";




const Tikets = () => {
    const user=useMember()
   const userId=user._id
   const workspaceId=user.workspace[0].workspaceId
  console.log(user,"uesrsdddddddd",userId,workspaceId)
  const [createTickets,] =useCreateTicketsMutation()
  const [updateMsg] = useUpdateMsgMutation()
  const {
    data: tickets = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetTicketsQuery(workspaceId ?? skipToken);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
console.log(tickets,"tiketsss")
  // Mock data
  // const [tickets, setTickets] = useState<Ticket[]>([
  //   {
  //     id: "TKT-001",
  //     title: "Unable to access workspace settings",
  //     description: "When I try to access the workspace settings page, I get a 403 error. This is blocking our team from updating permissions.",
  //     status: "open",
  //     category: "sample",
  //     priority: "high",
  //     createdAt: new Date("2024-01-15T10:30:00"),
  //     updatedAt: new Date("2024-01-15T10:30:00"),
  //     messages: [
  //       {
  //         id: "msg-1",
  //         sender: "admin",
  //         content: "Unable to access workspace settings. Getting 403 error.",
  //         timestamp: new Date("2024-01-15T10:30:00"),
  //       },
  //     ],
  //     workspaceId: "",
  //     userId: ""
  //   },
  //   {
  //     id: "TKT-002",
  //     title: "Billing invoice not generated",
  //     description: "The monthly billing invoice for December hasn't been generated yet. Need this urgently for accounting.",
  //     status: "in_progress",
  //     priority: "medium",
  //     category: "sapm1",
  //     createdAt: new Date("2024-01-14T14:20:00"),
  //     updatedAt: new Date("2024-01-15T09:15:00"),
  //     messages: [
  //       {
  //         id: "msg-2",
  //         sender: "admin",
  //         content: "December invoice is missing. Need it ASAP for accounting.",
  //         timestamp: new Date("2024-01-14T14:20:00"),
  //       },
  //       {
  //         id: "msg-3",
  //         sender: "super_admin",
  //         content: "Looking into this. Checking the billing system logs now.",
  //         timestamp: new Date("2024-01-15T09:15:00"),
  //       },
  //     ],
  //     workspaceId: "",
  //     userId: ""
  //   },
  //   {
  //     id: "TKT-003",
  //     title: "API rate limit issues",
  //     description: "We're experiencing frequent rate limit errors on the API endpoint /api/v1/users even though we're within our plan limits.",
  //     status: "resolved",
  //     priority: "critical",
  //     category: "mmmm",
  //     createdAt: new Date("2024-01-13T08:00:00"),
  //     updatedAt: new Date("2024-01-14T16:30:00"),
  //     messages: [
  //       {
  //         id: "msg-4",
  //         sender: "admin",
  //         content: "Getting rate limited on /api/v1/users endpoint. We're within our limits.",
  //         timestamp: new Date("2024-01-13T08:00:00"),
  //       },
  //       {
  //         id: "msg-5",
  //         sender: "super_admin",
  //         content: "Found the issue - there was a misconfiguration in the rate limiter. Fixed now.",
  //         timestamp: new Date("2024-01-14T15:00:00"),
  //       },
  //       {
  //         id: "msg-6",
  //         sender: "super_admin",
  //         content: "Your issue has been resolved. Can you please verify that everything is working correctly now?",
  //         timestamp: new Date("2024-01-14T16:30:00"),
  //       },
  //     ],
  //     workspaceId: "",
  //     userId: ""
  //   },

  // ]);

  const handleSendMessage = async (ticketId: string, message: string) => {
    console.log(ticketId,message)
          const newMessage: Message = {
            sender: "admin",
            content: message,
            timestamp: new Date(),
          };

try {
  await updateMsg({msg:newMessage,id:ticketId})
  setSelectedTicket(prev =>
  prev
    ? { 
        ...prev, 
        messages: [...prev.messages, newMessage] 
      }
    : prev
);

} catch (error) {
  toast.error("failed to send")
  console.log(error)
}

    // setTickets((prevTickets) =>
    //   prevTickets.map((ticket) => {
    //     if (ticket.id === ticketId) {
    //       const newMessage: Message = {
    //         id: `msg-${Date.now()}`,
    //         sender: "admin",
    //         content: message,
    //         timestamp: new Date(),
    //       };
          
    //       const updatedTicket = {
    //         ...ticket,
    //         messages: [...ticket.messages, newMessage],
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

  const handleReopenTicket = (ticketId: string) => {
    // setTickets((prevTickets) =>
    //   prevTickets.map((ticket) => {
    //     if (ticket.id === ticketId) {
    //       const updatedTicket = {
    //         ...ticket,
    //         status: "reopened" as TicketStatus,
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

  const handleCreateTicket = async (newTicket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "messages">) => {
    console.log(newTicket,"newTicke")
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
      workspaceId:workspaceId,
      userId:userId,
    };

    // setTickets([ticket, ...tickets]);
    try {
      console.log("Sunmitted")
      console.log(ticket,"my tiketssss")
      
      const data=await createTickets(ticket).unwrap()
      console.log(data,"api666+++")

    } catch (error) {
      console.log(error,"errorr")
      toast.error("Unble to Raise tickets")
    }
    console.log(ticket,"tiket new ")
  };

  return (
    <div className="flex h-screen bg-background">
      <div className={`flex-1 transition-all duration-300 ${selectedTicket ? "lg:w-1/2" : "w-full"}`}>
        <TicketDashboard
          tickets={tickets}
          onSelectTicket={setSelectedTicket}
          selectedTicketId={selectedTicket?.SLno}
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
  );
};

export default Tikets;
