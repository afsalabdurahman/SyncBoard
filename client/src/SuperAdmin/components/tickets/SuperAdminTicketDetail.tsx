import { useState, useRef, useEffect } from "react";
import {  TicketStatus } from "../../pages/TicketIndex";
import {Ticket} from "../../../Admin/types/TiketTypes"
import { Button } from "../../../Custom/ui/button";
import { Textarea } from "../../../Custom/ui/textarea";
import { Badge } from "../../../Custom/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../Custom/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../Custom/ui/dialog";
import { ScrollArea } from "../../../Custom/ui/scrollArea";
import { Send, Building2, Users, Clock, AlertCircle, CheckCircle2, PlayCircle, RotateCcw } from "lucide-react";
import { cn } from "../../../Utility/cn";
import {formatDate} from"../../../Utility/dateConverter"
interface SuperAdminTicketDetailProps {
  ticket: Ticket;
  onSendMessage: (ticketId: string, message: string) => void;
  onStatusChange: (ticketId: string, status: TicketStatus) => void;
}

const SuperAdminTicketDetail = ({ ticket, onSendMessage, onStatusChange,  }: SuperAdminTicketDetailProps) => {
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loacState,setLocalstate]=useState<TicketStatus>(ticket.status)
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
      setIsDialogOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
   
     setLocalstate(newStatus)
    onStatusChange(ticket._id, newStatus as TicketStatus);
   
  };

  const getStatusVariant = (status: TicketStatus) => {
    const variants = {
      open: "default",
      in_progress: "secondary",
      resolved: "outline",
      reopened: "destructive",
    };
    return variants[status] as "default" | "secondary" | "outline" | "destructive";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "text-success",
      medium: "text-warning",
      high: "text-destructive",
    };
    return colors[priority as keyof typeof colors];
  };

 

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4" />;
      case "in_progress":
        return <PlayCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "reopened":
        return <RotateCcw className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 sm:p-6 flex-shrink-0">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs sm:text-sm font-mono text-muted-foreground">{ticket.id}</span>
                <Badge variant={getStatusVariant(ticket.status)} className="gap-1">
                  {getStatusIcon(ticket.status)}
                  <span className="text-xs">{ticket.status.replace("_", " ")}</span>
                </Badge>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-2 break-words">{ticket.title}</h2>
              <p className="text-sm sm:text-base text-muted-foreground break-words">{ticket.description}</p>
            </div>
          </div>

          {/* Status Control */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">Change Status</label>
            <Select value={loacState} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="reopened">Reopened</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ticket Context */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="text-xs sm:text-sm font-medium truncate">{ticket.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Workspace</p>
                <p className="text-xs sm:text-sm font-medium truncate">{ticket.workspace}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className={cn("w-4 h-4 flex-shrink-0", getPriorityColor(ticket.priority))} />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Priority</p>
                <p className={cn("text-xs sm:text-sm font-medium capitalize", getPriorityColor(ticket.priority))}>
                  {ticket.priority}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Updated</p>
                <p className="text-xs sm:text-sm font-medium">{formatDate(ticket.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {ticket.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.sender === "admin" ? "justify-start" : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] sm:max-w-[70%] rounded-lg p-3 sm:p-4",
                  msg.sender === "admin"
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                <p className="text-xs sm:text-sm mb-1 break-words">{msg.content}</p>
                <p
                  className={cn(
                    "text-xs",
                    msg.sender === "admin" ? "text-muted-foreground" : "text-primary-foreground/70"
                  )}
                >
                  {formatDate(msg.timestamp)} • {msg.sender === "admin" ? "Admin" : "Super Admin"}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Send Message Button */}
      <div className="border-t border-border p-3 sm:p-4 flex-shrink-0">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2" size="lg">
              <Send className="w-4 h-4" />
              Send Message
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-sm sm:text-base">Send Message to {ticket.company} - {ticket.workspace}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Textarea
                placeholder="Type your response..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[150px] sm:min-h-[200px] resize-none"
                autoFocus
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  Press Enter to send, Shift + Enter for new line
                </p>
                <Button onClick={handleSend} disabled={!message.trim()} className="gap-2 w-full sm:w-auto">
                  <Send className="w-4 h-4" />
                  Send
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SuperAdminTicketDetail;
