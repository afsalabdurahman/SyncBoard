"use client"

import { Search, Download, Plus, Filter } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"

interface TicketFiltersProps {
  search: string
  onSearch: (v: string) => void
  status: string
  onStatus: (v: string) => void
  priority: string
  onPriority: (v: string) => void
  channel: string
  onChannel: (v: string) => void
  onExport: () => void
  onNewTicket: () => void
}

export function TicketFilters({
  search,
  onSearch,
  status,
  onStatus,
  priority,
  onPriority,
  channel,
  onChannel,
  onExport,
  onNewTicket,
}: TicketFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
      <div className="flex flex-col md:flex-row gap-3 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by subject, requester email, or ticket ID..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={status} onValueChange={onStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={onPriority}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={channel} onValueChange={onChannel}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="api">API</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport} className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button onClick={onNewTicket} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Ticket
        </Button>
      </div>
    </div>
  )
}
