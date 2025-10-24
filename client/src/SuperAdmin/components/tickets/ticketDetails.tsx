"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../Custom/ui/dialog"
import { Badge } from "../../../Custom/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar"
import { Card, CardContent } from "../../../Custom/ui/card"
import { Textarea } from "../../../Custom/ui/textarea"
import { Button } from "../../../Custom/ui/button"
import { Send, Tag, Clock, MessageSquare, UserRound } from "lucide-react"
import type { Ticket } from "./ticketTable"

export function TicketDetails({
  open,
  onOpenChange,
  ticket,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  ticket: Ticket | null
}) {
  if (!ticket) return null

  const statusTone =
    ticket.status === "open"
      ? "bg-blue-100 text-blue-800"
      : ticket.status === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : ticket.status === "resolved"
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800"

  const priorityTone =
    ticket.priority === "urgent"
      ? "bg-red-100 text-red-800"
      : ticket.priority === "high"
        ? "bg-orange-100 text-orange-800"
        : ticket.priority === "medium"
          ? "bg-slate-100 text-slate-800"
          : "bg-gray-100 text-gray-800"

  const fmt = (d: string) =>
    new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <span className="truncate">{ticket.subject}</span>
            <Badge variant="secondary" className={statusTone}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Badge>
            <Badge variant="secondary" className={priorityTone}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Header info */}
          <Card>
            <CardContent className="p-4 grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={ticket.requester.avatar || "/placeholder.svg?height=40&width=40&query=requester"}
                    alt={ticket.requester.name}
                  />
                  <AvatarFallback>
                    {ticket.requester.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900">{ticket.requester.name}</div>
                  <div className="text-sm text-gray-600 truncate">{ticket.requester.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Created: {fmt(ticket.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Updated: {fmt(ticket.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <span>Channel: {ticket.channel.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <UserRound className="h-4 w-4 text-gray-400" />
                  <span>Assignee: {ticket.assignee?.name || "Unassigned"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {ticket.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-gray-400" />
              {ticket.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Conversation */}
          <Card>
            <CardContent className="p-4 space-y-4 max-h-[320px] overflow-auto">
              {ticket.messages.map((m, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={m.avatar || "/placeholder.svg?height=32&width=32&query=person"} alt={m.name} />
                    <AvatarFallback>
                      {m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-900">{m.name}</span>
                      <span className="text-xs text-gray-500">{fmt(m.time)}</span>
                    </div>
                    <p className="text-sm text-gray-800 mt-1">{m.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick reply */}
          <div className="grid gap-2">
            <Textarea placeholder="Write a reply to the customer..." className="min-h-[90px]" />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline">Add Note</Button>
              <Button className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
