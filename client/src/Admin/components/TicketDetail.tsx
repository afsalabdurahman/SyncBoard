import { useState, useRef, useEffect } from "react";
import { Ticket } from "../types/TiketTypes";
import { Button } from "../../Custom/ui/button";
import { Textarea } from "../../Custom/ui/textarea";
import { Badge } from "../../Custom/ui/badge";
import { X, Send, Building2, Users, Clock, AlertCircle, RotateCcw,Rotate3DIcon } from "lucide-react";
import { cn } from "../../Utility/cn";
import {formatTimestamp} from "../../Utility/dateConverter"
interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
  onSendMessage: (ticketId: string, message: string) => void;
  onReopenTicket: (ticketId: string) => void;
}

const TicketDetail = ({ ticket, onClose, onSendMessage, onReopenTicket }: TicketDetailProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(ticket._id, message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusVariant = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return "default";
      case "in_progress":
        return "secondary";
      case "resolved":
        return "outline";
      case "reopened":
        return "destructive";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "critical":
        return "text-destructive";
      case "high":
        return "text-warning";
      case "medium":
        return "text-primary";
      case "low":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

 

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono text-muted-foreground">{ticket.SLno}</span>
              <Badge variant={getStatusVariant(ticket.status)} className="capitalize">
                {ticket.status.replace("_", " ")}
              </Badge>
              <span className={cn("text-xs font-semibold uppercase", getPriorityColor(ticket.priority))}>
                {ticket.priority}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{ticket.title}</h2>
            <p className="text-muted-foreground">{ticket.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Rotate3DIcon className="w-4 h-4" />
            <span>{ticket.category}</span>
          </div>
         
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Created {formatTimestamp(ticket.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {ticket.status === "resolved" && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-success mb-1">Issue Resolved</p>
              <p className="text-sm text-foreground">
                The super admin has marked this issue as resolved. If you're still experiencing problems, send a message below to reopen the ticket.
              </p>
            </div>
          </div>
        )}

        {ticket.messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.sender === "admin" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-lg p-4 shadow-sm",
                msg.sender === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold">
                  {msg.sender === "admin" ? "You" : "Super Admin"}
                </span>
                <span className={cn(
                  "text-xs",
                  msg.sender === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input / Reopen Section */}
      <div className="border-t border-border p-4">
        {ticket.status === "resolved" ? (
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                This ticket has been resolved. If you're still experiencing the issue, you can reopen the ticket to continue the conversation.
              </p>
              <Button 
                onClick={() => onReopenTicket(ticket.id)} 
                className="gap-2"
                variant="outline"
              >
                <RotateCcw className="w-4 h-4" />
                Reopen Ticket
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[60px] resize-none"
              />
              <Button onClick={handleSend} disabled={!message.trim()} size="icon" className="h-[60px]">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift + Enter for new line
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
