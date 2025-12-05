import { useState,useEffect } from "react";
import TicketDashboard from "../components/TicketDashboard";
import TicketDetail from "../components/TicketDetail";
import {Ticket,Message,TicketStatus} from "../types/TiketTypes"
import { useCreateTicketsMutation, useGetTicketsQuery,useUpdateMsgMutation } from "../apis/rtqApi";
import { toast } from "react-toastify";
import { useMember } from "../../Member/hooks/memeberhooks";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useUpdateTicketStatusMutation } from "../../SuperAdmin/apis/fetchApi";




const Tikets = () => {
  const [updateTicketStatus]=useUpdateTicketStatusMutation()
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

  console.log(tickets,"data","66666")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
// useEffect(()=>{
// refetch()
// },[])


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

  };

  const handleReopenTicket = async(ticketId: string) => {
    try {
       await updateTicketStatus({ticketId,newStatus:"in_progress"})
    } catch (error) {
      console.log(error)
    }
   
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
