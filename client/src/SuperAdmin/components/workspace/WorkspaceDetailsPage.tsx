"use client"

import { useMemo, useState } from "react"

import { Card, CardContent } from "../../../Custom/ui/card"
import { Badge } from "../../../Custom/ui/badge"
import { Button } from "../../../Custom/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar"
import { Building2, Users, MessageSquare, HardDrive, Calendar, Edit, PauseCircle, PlayCircle, Mail } from "lucide-react"
import { WorkspaceMembersTable, type WorkspaceMember } from "./workspaceMembers"
import { WorkspaceActivityTimeline, type ActivityItem } from "./workspaceActivity"
import { WorkspaceBillingCard } from "./workspaceBilling"
import { cn } from "../../../lib/utils"
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, AreaChart, Area } from "recharts"

type Plan = "basic" | "pro" | "enterprise"
type Status = "active" | "suspended" | "trial"

interface WorkspaceDetails {
  id: string
  name: string
  avatar?: string
  owner: { name: string; email: string; avatar?: string }
  plan: Plan
  status: Status
  createdAt: string
  lastActive: string
  storage: { usedGB: number; limitGB: number }
  monthlyMessages: number
  membersCount: number
  billing: {
    amount: number
    currency: "USD"
    interval: "month" | "year"
    nextRenewal: string
    paymentMethod: {
      brand: "visa" | "mastercard" | "amex" | "discover"
      last4: string
      expMonth: number
      expYear: number
    }
    status: "active" | "trialing" | "past_due" | "canceled"
    cancelAtPeriodEnd: boolean
  }
}

// Mock workspace data
const workspace: WorkspaceDetails = {
  id: "ws_1234567890",
  name: "Acme Corporation",
  avatar: "/workspace-logo.jpg",
  owner: { name: "John Smith", email: "john../../..acme.com", avatar: "/person-holding-keys.png" },
  plan: "enterprise",
  status: "active",
  createdAt: "2023-01-15",
  lastActive: "2025-10-12",
  storage: { usedGB: 85, limitGB: 100 },
  monthlyMessages: 182340,
  membersCount: 245,
  billing: {
    amount: 2499,
    currency: "USD",
    interval: "month",
    nextRenewal: "2025-11-10",
    paymentMethod: { brand: "visa", last4: "4242", expMonth: 4, expYear: 2027 },
    status: "active",
    cancelAtPeriodEnd: false,
  },
}

// Mock members
const mockMembers: WorkspaceMember[] = [
  {
    id: "m1",
    name: "John Smith",
    email: "john../../..acme.com",
    role: "owner",
    status: "active",
    joinedAt: "2023-01-15",
    lastActive: "2025-10-12",
    twoFactorEnabled: true,
    isEmailVerified: true,
  },
  {
    id: "m2",
    name: "Sarah Johnson",
    email: "sarah../../..acme.com",
    role: "admin",
    status: "active",
    joinedAt: "2023-03-10",
    lastActive: "2025-10-12",
    twoFactorEnabled: false,
    isEmailVerified: true,
  },
  {
    id: "m3",
    name: "Mike Chen",
    email: "mike../../..acme.com",
    role: "member",
    status: "active",
    joinedAt: "2023-06-01",
    lastActive: "2025-10-11",
    twoFactorEnabled: false,
    isEmailVerified: false,
  },
  {
    id: "m4",
    name: "Emily Davis",
    email: "emily../../..acme.com",
    role: "admin",
    status: "suspended",
    joinedAt: "2023-07-20",
    lastActive: "2025-10-02",
    twoFactorEnabled: true,
    isEmailVerified: true,
  },
  {
    id: "m5",
    name: "David Wilson",
    email: "david../../..acme.com",
    role: "member",
    status: "pending",
    joinedAt: "2025-10-10",
    lastActive: "2025-10-10",
    twoFactorEnabled: false,
    isEmailVerified: false,
  },
]

// Mock activity
const activity: ActivityItem[] = [
  {
    id: "a1",
    type: "member_added",
    title: "Added Lisa Thompson to Acme Corporation",
    description: "Role: Member",
    time: "2025-10-12T09:30:00Z",
  },
  {
    id: "a2",
    type: "billing",
    title: "Monthly invoice paid",
    description: "Amount: $2,499 USD",
    time: "2025-10-10T02:10:00Z",
  },
  {
    id: "a3",
    type: "setting_change",
    title: "File uploads enabled",
    description: "Max file size: 50MB",
    time: "2025-10-08T11:20:00Z",
  },
  {
    id: "a4",
    type: "message",
    title: "Peak daily messages reached",
    description: "87,540 messages sent",
    time: "2025-10-07T18:05:00Z",
  },
]

function generateSeries(days = 30) {
  const now = new Date()
  const out: { label: string; messages: number; dau: number }[] = []
  for (let i = days; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const messages = Math.max(2000, Math.floor(6000 + Math.sin(i / 5) * 1800 + Math.random() * 1400))
    const dau = Math.max(200, Math.floor(800 + Math.cos(i / 7) * 220 + Math.random() * 120))
    out.push({ label, messages, dau })
  }
  return out
}

export default function WorkspaceDetailsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const series = useMemo(() => generateSeries(30), [])

  const planColors = {
    basic: "bg-gray-100 text-gray-800",
    pro: "bg-purple-100 text-purple-800",
    enterprise: "bg-orange-100 text-orange-800",
  } as const

  const statusColors = {
    active: "bg-green-100 text-green-800",
    suspended: "bg-red-100 text-red-800",
    trial: "bg-blue-100 text-blue-800",
  } as const

  const storagePct = Math.min(100, Math.round((workspace.storage.usedGB / workspace.storage.limitGB) * 100))

  const suspend = () => console.log("Suspend workspace:", workspace.id)
  const reactivate = () => console.log("Reactivate workspace:", workspace.id)
  const edit = () => console.log("Edit workspace:", workspace.id)
  const messageOwner = () => console.log("Message owner:", workspace.owner.email)

  const onViewMember = (m: WorkspaceMember) => console.log("View member", m.id)
  const onChangeRole = (m: WorkspaceMember) => console.log("Change role", m.id)
  const onSuspendMember = (m: WorkspaceMember) => console.log("Suspend member", m.id)
  const onRemoveMember = (m: WorkspaceMember) => console.log("Remove member", m.id)

  return (
    <div className="min-h-screen bg-gray-50">
   

      <main className={cn("transition-all duration-300 pt-16", sidebarCollapsed ? "ml-16" : "ml-64")}>
        <div className="p-6 space-y-8">
          {/* Header section */}
          <div className="rounded-xl bg-white border p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarImage
                    src={workspace.avatar || "/placeholder.svg?height=48&width=48&query=workspace-logo"}
                    alt={workspace.name}
                  />
                  <AvatarFallback>
                    {workspace.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-semibold text-gray-900 truncate">{workspace.name}</h1>
                    <Badge variant="secondary" className={planColors[workspace.plan]}>
                      {workspace.plan.charAt(0).toUpperCase() + workspace.plan.slice(1)}
                    </Badge>
                    <Badge variant="secondary" className={statusColors[workspace.status]}>
                      {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 flex-wrap">
                    <span className="text-xs rounded bg-gray-100 px-2 py-0.5">ID: {workspace.id}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Created {new Date(workspace.createdAt).toLocaleDateString("en-US")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Last active {new Date(workspace.lastActive).toLocaleDateString("en-US")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {workspace.status === "suspended" ? (
                  <Button variant="outline" onClick={reactivate} className="gap-2 bg-transparent">
                    <PlayCircle className="h-4 w-4" />
                    Reactivate
                  </Button>
                ) : (
                  <Button variant="outline" onClick={suspend} className="gap-2 bg-transparent">
                    <PauseCircle className="h-4 w-4" />
                    Suspend
                  </Button>
                )}
                <Button variant="outline" onClick={messageOwner} className="gap-2 bg-transparent">
                  <Mail className="h-4 w-4" />
                  Message Owner
                </Button>
                <Button onClick={edit} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Workspace
                </Button>
              </div>
            </div>

            {/* Owner */}
            <div className="mt-4 flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={workspace.owner.avatar || "/placeholder.svg?height=32&width=32&query=owner"}
                  alt={workspace.owner.name}
                />
                <AvatarFallback>
                  {workspace.owner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{workspace.owner.name}</div>
                <div className="text-gray-600">{workspace.owner.email}</div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Members</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{workspace.membersCount.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Messages</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {workspace.monthlyMessages.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Storage Used</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{workspace.storage.usedGB}GB</p>
                    <div className="text-sm text-gray-600">of {workspace.storage.limitGB}GB</div>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <HardDrive className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${storagePct}%` }} />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Last Active</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {new Date(workspace.lastActive).toLocaleDateString("en-US")}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts + Billing */}
          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
            <div className="space-y-6 2xl:col-span-2">
              <Card>
                <CardContent className="p-5">
                  <div className="text-lg font-semibold text-gray-900 mb-3">Messages Over Time</div>
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={series} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="messages" stroke="#2563eb" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="text-lg font-semibold text-gray-900 mb-3">Daily Active Users</div>
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={series} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
                        <defs>
                          <linearGradient id="fillDau" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="dau" stroke="#10b981" fill="url(#fillDau)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <WorkspaceBillingCard
                plan={workspace.plan}
                amount={workspace.billing.amount}
                currency={workspace.billing.currency}
                interval={workspace.billing.interval}
                nextRenewal={workspace.billing.nextRenewal}
                paymentMethod={workspace.billing.paymentMethod}
                status={workspace.billing.status}
                cancelAtPeriodEnd={workspace.billing.cancelAtPeriodEnd}
              />

              <WorkspaceActivityTimeline items={activity} />
            </div>
          </div>

          {/* Members */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Members</h2>
              <div className="flex gap-2">
                <Button variant="outline">Invite Member</Button>
                <Button>Manage Roles</Button>
              </div>
            </div>
            <WorkspaceMembersTable
              members={mockMembers}
              onView={onViewMember}
              onChangeRole={onChangeRole}
              onSuspend={onSuspendMember}
              onRemove={onRemoveMember}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
