import { useState, useRef, useEffect } from "react";
import { Ticket, TicketStatus } from "../../../Admin/types/TiketTypes";
import { Button } from "../../../Custom/ui/button";
import { Textarea } from "../../../Custom/ui/textarea";
import { Badge } from "../../../Custom/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../Custom/ui/select";
import { ScrollArea } from "../../../Custom/ui/s";
import { Send, Building2, Users, Clock, AlertCircle, CheckCircle2, PlayCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface SuperAdminTicketDetailProps {
  ticket: Ticket;
  onSendMessage: (ticketId: string, message: string) => void;
  onStatusChange: (ticketId: string, status: TicketStatus) => void;
}

const SuperAdminTicketDetail = ({ ticket, onSendMessage, onStatusChange }: SuperAdminTicketDetailProps) => {
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
      onSendMessage(ticket.id, message);
      setMessage("");
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(ticket.id, newStatus as TicketStatus);
    toast({
      title: "Status Updated",
      description: `Ticket status changed to ${newStatus.replace("_", " ")}`,
    });
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

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
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
      <div className="border-b border-border/50 px-8 py-6 flex-shrink-0 animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title & Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground/70 tracking-wider">
                {ticket.id}
              </span>
              <Badge 
                variant={getStatusVariant(ticket.status)} 
                className="gap-1.5 px-3 py-1 rounded-full"
              >
                {getStatusIcon(ticket.status)}
                <span className="text-xs font-medium">
                  {ticket.status.replace("_", " ")}
                </span>
              </Badge>
            </div>
            <h2 className="text-3xl font-semibold text-foreground tracking-tight">
              {ticket.title}
            </h2>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Ticket Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground/60">
                <Building2 className="w-3.5 h-3.5" />
                <p className="text-xs font-medium uppercase tracking-wide">Company</p>
              </div>
              <p className="text-sm font-medium text-foreground pl-5">{ticket.company}</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground/60">
                <Users className="w-3.5 h-3.5" />
                <p className="text-xs font-medium uppercase tracking-wide">Workspace</p>
              </div>
              <p className="text-sm font-medium text-foreground pl-5">{ticket.workspace}</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <AlertCircle className={cn("w-3.5 h-3.5", getPriorityColor(ticket.priority))} />
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/60">Priority</p>
              </div>
              <p className={cn("text-sm font-medium capitalize pl-5", getPriorityColor(ticket.priority))}>
                {ticket.priority}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground/60">
                <Clock className="w-3.5 h-3.5" />
                <p className="text-xs font-medium uppercase tracking-wide">Updated</p>
              </div>
              <p className="text-sm font-medium text-foreground pl-5">{formatDate(ticket.updatedAt)}</p>
            </div>
          </div>

          {/* Status Control */}
          <div className="pt-2">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground/60 mb-3 block">
              Change Status
            </label>
            <Select value={ticket.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full md:w-64 h-11 rounded-lg border-border/50">
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
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-8 py-8 [&>[data-radix-scroll-area-viewport]]:scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
          {ticket.messages.map((msg, index) => (
            <div
              key={msg.id}
              className={cn(
                "flex animate-fade-in",
                msg.sender === "admin" ? "justify-start" : "justify-end"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-5 py-4 shadow-sm",
                  msg.sender === "admin"
                    ? "bg-muted/50 text-foreground border border-border/30"
                    : "bg-primary/95 text-primary-foreground"
                )}
              >
                <p className="text-[15px] leading-relaxed mb-2">{msg.content}</p>
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-[11px] font-medium uppercase tracking-wider",
                      msg.sender === "admin" ? "text-muted-foreground/60" : "text-primary-foreground/60"
                    )}
                  >
                    {msg.sender === "admin" ? "Admin" : "Super Admin"}
                  </p>
                  <span className={cn(
                    "text-[11px]",
                    msg.sender === "admin" ? "text-muted-foreground/50" : "text-primary-foreground/50"
                  )}>•</span>
                  <p
                    className={cn(
                      "text-[11px]",
                      msg.sender === "admin" ? "text-muted-foreground/50" : "text-primary-foreground/50"
                    )}
                  >
                    {formatDate(msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-border/50 px-8 py-6 flex-shrink-0 bg-muted/20">
        <div className="max-w-4xl mx-auto space-y-4">
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[120px] resize-none rounded-xl border-border/50 bg-background focus-visible:ring-1 focus-visible:ring-primary/20 text-[15px] leading-relaxed"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground/60 tracking-wide">
              Press <kbd className="px-1.5 py-0.5 text-[10px] bg-muted rounded">Enter</kbd> to send, 
              <kbd className="px-1.5 py-0.5 text-[10px] bg-muted rounded ml-1">Shift + Enter</kbd> for new line
            </p>
            <Button 
              onClick={handleSend} 
              disabled={!message.trim()} 
              className="gap-2 h-11 px-6 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminTicketDetail;
