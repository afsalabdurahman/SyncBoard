"use client"

import { useMemo, useState } from "react"

import { TicketStats } from "../components/tickets/ticketState"
import { TicketFilters } from "../components/tickets/tiketFilter"
import { TicketTable, type Ticket } from "../components/tickets/ticketTable"
import { TicketDetails } from "../components/tickets/ticketDetails"

// Mock dataset
const mockTickets: Ticket[] = [
  {
    id: "tkt_9012AB",
    subject: "Cannot invite members to workspace",
    requester: { name: "John Smith", email: "john@acme.com", avatar: "/thoughtful-man-in-library.png" },
    assignee: { name: "Sarah Johnson", avatar: "/diverse-group-smiling.png" },
    status: "open",
    priority: "high",
    channel: "web",
    tags: ["invites", "workspace"],
    createdAt: "2025-10-09T10:20:00Z",
    updatedAt: "2025-10-12T10:15:00Z",
    messages: [
      {
        author: "requester",
        name: "John Smith",
        time: "2025-10-09T10:20:00Z",
        text: "I'm trying to invite a colleague but get an error.",
      },
      {
        author: "agent",
        name: "Sarah Johnson",
        time: "2025-10-09T10:35:00Z",
        text: "Thanks for reaching out. Could you share the error message?",
      },
    ],
  },
  {
    id: "tkt_77XZPQ",
    subject: "Billing charged twice for October",
    requester: { name: "Emily Davis", email: "emily@marketing.co" },
    assignee: { name: "Mike Chen" },
    status: "pending",
    priority: "urgent",
    channel: "email",
    tags: ["billing", "duplicate-charge"],
    createdAt: "2025-10-11T08:00:00Z",
    updatedAt: "2025-10-12T12:10:00Z",
    messages: [
      { author: "requester", name: "Emily Davis", time: "2025-10-11T08:00:00Z", text: "I see two charges in my bank." },
      {
        author: "agent",
        name: "Mike Chen",
        time: "2025-10-11T09:10:00Z",
        text: "We're checking with billing. We'll update you shortly.",
      },
    ],
  },
  {
    id: "tkt_55LMNO",
    subject: "API rate limits unclear in documentation",
    requester: { name: "Alex Rodriguez", email: "alex@freelance.com" },
    assignee: null,
    status: "open",
    priority: "medium",
    channel: "api",
    tags: ["docs", "api"],
    createdAt: "2025-10-10T14:50:00Z",
    updatedAt: "2025-10-11T11:05:00Z",
    messages: [
      {
        author: "requester",
        name: "Alex Rodriguez",
        time: "2025-10-10T14:50:00Z",
        text: "What are the per-minute limits?",
      },
    ],
  },
  {
    id: "tkt_33ABCD",
    subject: "Can't reset password",
    requester: { name: "Lisa Thompson", email: "lisa@newcompany.com" },
    assignee: { name: "David Wilson" },
    status: "resolved",
    priority: "low",
    channel: "chat",
    tags: ["auth", "password"],
    createdAt: "2025-10-08T09:15:00Z",
    updatedAt: "2025-10-09T10:00:00Z",
    messages: [
      {
        author: "requester",
        name: "Lisa Thompson",
        time: "2025-10-08T09:15:00Z",
        text: "Password reset link expired.",
      },
      {
        author: "agent",
        name: "David Wilson",
        time: "2025-10-08T09:40:00Z",
        text: "I sent a fresh reset link and extended validity.",
      },
    ],
  },
  {
    id: "tkt_22WXYZ",
    subject: "Messages failing to deliver intermittently",
    requester: { name: "Startup Hub Ops", email: "ops@startuphub.com" },
    assignee: { name: "Sarah Johnson" },
    status: "open",
    priority: "urgent",
    channel: "web",
    tags: ["messages", "delivery", "incident"],
    createdAt: "2025-10-12T06:45:00Z",
    updatedAt: "2025-10-12T12:25:00Z",
    messages: [
      {
        author: "requester",
        name: "Startup Hub Ops",
        time: "2025-10-12T06:45:00Z",
        text: "We see intermittent delivery failures since 6AM UTC.",
      },
    ],
  },
]

export const  SupportTicketsPage =()=> {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Filters
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [priority, setPriority] = useState("all")
  const [channel, setChannel] = useState("all")

  // Details modal
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [openDetails, setOpenDetails] = useState(false)

  const filtered = useMemo(() => {
    return mockTickets.filter((t) => {
      const matchesSearch =
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.requester.email.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === "all" || t.status === (status as any)
      const matchesPriority = priority === "all" || t.priority === (priority as any)
      const matchesChannel = channel === "all" || t.channel === (channel as any)
      return matchesSearch && matchesStatus && matchesPriority && matchesChannel
    })
  }, [search, status, priority, channel])

  // Stats (derived)
  const stats = {
    open: mockTickets.filter((t) => t.status === "open").length,
    pending: mockTickets.filter((t) => t.status === "pending").length,
    resolvedToday: mockTickets.filter((t) => t.status === "resolved").length,
    avgResponseMins: 22,
  }

  // Handlers (stubs)
  const onView = (t: Ticket) => {
    setSelected(t)
    setOpenDetails(true)
  }
  const onAssign = (t: Ticket) => {
    console.log("Assign ticket:", t.id)
  }
  const onChangePriority = (t: Ticket) => {
    console.log("Change priority:", t.id)
  }
  const onResolve = (t: Ticket) => {
    console.log("Resolve ticket:", t.id)
  }
  const onClose = (t: Ticket) => {
    console.log("Close ticket:", t.id)
  }
  const onDelete = (t: Ticket) => {
    console.log("Delete ticket:", t.id)
  }

  const onExport = () => console.log("Export tickets")
  const onNewTicket = () => console.log("Create new ticket")

  return (
    <div className="min-h-screen bg-gray-50">
   

      <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-1">Track, triage, and resolve customer issues efficiently</p>
          </div>

          {/* KPI Cards */}
          <TicketStats {...stats} />

          {/* Filters */}
          <TicketFilters
            search={search}
            onSearch={setSearch}
            status={status}
            onStatus={setStatus}
            priority={priority}
            onPriority={setPriority}
            channel={channel}
            onChannel={setChannel}
            onExport={onExport}
            onNewTicket={onNewTicket}
          />

          {/* Results count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filtered.length} of {mockTickets.length} tickets
          </div>

          {/* Table */}
          <TicketTable
            tickets={filtered}
            onView={onView}
            onAssign={onAssign}
            onChangePriority={onChangePriority}
            onResolve={onResolve}
            onClose={onClose}
            onDelete={onDelete}
          />
        </div>
      </main>

      <TicketDetails open={openDetails} onOpenChange={setOpenDetails} ticket={selected} />
    </div>
  )
}
