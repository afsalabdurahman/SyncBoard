"use client"

import { Card, CardContent } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Calendar, MessageSquare, MoreHorizontal, UserRound } from "lucide-react"

export type TicketStatus = "open" | "pending" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "urgent"
export type TicketChannel = "email" | "chat" | "web" | "api"

export interface Ticket {
  id: string
  subject: string
  requester: { name: string; email: string; avatar?: string }
  assignee?: { name: string; avatar?: string } | null
  status: TicketStatus
  priority: TicketPriority
  channel: TicketChannel
  tags: string[]
  createdAt: string
  updatedAt: string
  messages: { author: "requester" | "agent"; name: string; avatar?: string; time: string; text: string }[]
}

const statusColors: Record<TicketStatus, string> = {
  open: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
}

const priorityColors: Record<TicketPriority, string> = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-slate-100 text-slate-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

const channelLabels: Record<TicketChannel, string> = {
  email: "Email",
  chat: "Chat",
  web: "Web",
  api: "API",
}

export function TicketTable({
  tickets,
  onView,
  onAssign,
  onChangePriority,
  onResolve,
  onClose,
  onDelete,
}: {
  tickets: Ticket[]
  onView: (t: Ticket) => void
  onAssign: (t: Ticket) => void
  onChangePriority: (t: Ticket) => void
  onResolve: (t: Ticket) => void
  onClose: (t: Ticket) => void
  onDelete: (t: Ticket) => void
}) {
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{t.subject}</div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {t.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={t.requester.avatar || "/placeholder.svg?height=40&width=40&query=requester"}
                        alt={t.requester.name}
                      />
                      <AvatarFallback>
                        {t.requester.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{t.requester.name}</div>
                      <div className="text-xs text-gray-500 truncate">{t.requester.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[t.status]}>
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={priorityColors[t.priority]}>
                    {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {t.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage
                          src={t.assignee.avatar || "/placeholder.svg?height=40&width=40&query=agent"}
                          alt={t.assignee.name}
                        />
                        <AvatarFallback>
                          {t.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">{t.assignee.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500">
                      <UserRound className="h-4 w-4" />
                      <span className="text-sm">Unassigned</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <span>{channelLabels[t.channel]}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{fmtDate(t.createdAt)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{fmtDate(t.updatedAt)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onView(t)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAssign(t)}>
                        {t.assignee ? "Reassign" : "Assign"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangePriority(t)}>Change Priority</DropdownMenuItem>
                      {t.status !== "resolved" && (
                        <DropdownMenuItem onClick={() => onResolve(t)}>Mark Resolved</DropdownMenuItem>
                      )}
                      {t.status !== "closed" && (
                        <DropdownMenuItem onClick={() => onClose(t)}>Close Ticket</DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(t)} className="text-red-600">
                        Delete Ticket
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
