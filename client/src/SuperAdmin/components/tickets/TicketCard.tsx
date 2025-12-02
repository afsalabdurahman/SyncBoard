import { Ticket } from "../../pages/TicketIndex";
import { Badge } from "../../../Custom/ui/badge";
import { Building2, Users, Clock, MessageSquare } from "lucide-react";
import { cn } from "../../../Utility/cn";
import {formatDate} from"../../../Utility/dateConverter"

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
  isSelected: boolean;
}

const TicketCard = ({ ticket, onClick, isSelected }: TicketCardProps) => {
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

  // const formatDate = (date: Date) => {
  //   const now = new Date();
  //   const diff = now.getTime() - date.getTime();
  //   const hours = Math.floor(diff / (1000 * 60 * 60));
  //   const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  //   if (hours < 1) return "Just now";
  //   if (hours < 24) return `${hours}h ago`;
  //   if (days < 7) return `${days}d ago`;
  //   return date.toLocaleDateString();
  // };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg border border-border bg-card cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50",
        isSelected && "border-primary shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono text-muted-foreground">{ticket.id}</span>
            <Badge variant={getStatusVariant(ticket.status)} className="capitalize">
              {ticket.status.replace("_", " ")}
            </Badge>
            <span className={cn("text-xs font-semibold uppercase", getPriorityColor(ticket.priority))}>
              {ticket.priority}
            </span>
          </div>
          <h3 className="font-semibold text-foreground text-lg mb-1 truncate">{ticket.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{ticket.workspace}</span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{ticket.company}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{ticket.messages.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(ticket.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
