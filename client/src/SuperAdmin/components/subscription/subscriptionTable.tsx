"use client"

import { Card, CardContent } from "../../../Custom/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../Custom/ui/table"
import { Badge } from "../../../Custom/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar"
import { Calendar, CreditCard, DollarSign, AlertTriangle, Eye, } from "lucide-react"

export type Plan = "basic" | "pro" | "enterprise"
export type SubStatus = "active" | "trialing" | "past_due" | "canceled"
export type Interval = "month" | "year"

export interface Subscription {
  id: string
  workspace: {
    name: string
    ownerName: string
    ownerEmail: string
    avatar?: string
  }
  plan: Plan
  status: SubStatus
  amount: number
  currency: "USD"
  interval: Interval
  startedAt: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  paymentMethod: {
    brand: "visa" | "mastercard" | "amex" | "discover"
    last4: string
    expMonth: number
    expYear: number
  }
  lastInvoiceStatus: "paid" | "past_due" | "void" | "uncollectible"
}

const statusColors: Record<SubStatus, string> = {
  active: "bg-green-100 text-green-800",
  trialing: "bg-blue-100 text-blue-800",
  past_due: "bg-orange-100 text-orange-800",
  canceled: "bg-gray-100 text-gray-800",
}

const planColors: Record<Plan, string> = {
  basic: "bg-gray-100 text-gray-800",
  pro: "bg-purple-100 text-purple-800",
  enterprise: "bg-orange-100 text-orange-800",
}

export function SubscriptionTable({
  data,
  onView,

}: {
  data: Subscription[]
  onView: (sub: Subscription) => void
  onChangePlan: (sub: Subscription) => void
  onCancel: (sub: Subscription) => void
  onRefund: (sub: Subscription) => void
}) {
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workspace</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Next Renewal</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>view</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {data
  .filter((_, index) => index % 2 === 0) // ✅ 0, 2, 4, 6...
  .map((sub) => (
    
    <TableRow key={sub.id} className="hover:bg-gray-50">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={sub.workspace.avatar || "/placeholder.svg"}
              alt={sub.workspace.name}
            />
           
            <AvatarFallback>
              {sub.workspace.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {sub.workspace.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {sub.workspace.ownerEmail}
            </div>
          </div>
        </div>
      </TableCell>
  <TableCell>
                  <Badge variant="secondary" className={planColors[sub.plan]}>
                    {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)} ·{" "}
                    {sub.interval === "year" ? "Yearly" : "Monthly"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[sub.status]}>
                    {sub.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>
                      {sub.amount.toLocaleString()} {sub.currency}
                      {sub.interval === "month" ? "/mo" : "/yr"}
                    </span>
                    {sub.lastInvoiceStatus === "past_due" && <AlertTriangle className="h-4 w-4 text-orange-500 ml-1" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{fmtDate(sub.currentPeriodEnd)}</span>
                  </div>
                  {sub.cancelAtPeriodEnd && <div className="text-xs text-red-600">Cancels at period end</div>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="uppercase">{sub.paymentMethod.brand}</span>
                    <span>•••• {sub.paymentMethod.last4}</span>
                    <span className="text-gray-500">
                      {String(sub.paymentMethod.expMonth).padStart(2, "0")}/
                      {String(sub.paymentMethod.expYear).slice(-2)}
                    </span>
                  </div>
                </TableCell>
                 <TableCell>
              
  <button
    onClick={() => onView(sub)}
    className="p-1.5 rounded-md hover:bg-muted transition-colors"
    title="View Details"
  >
    <Eye className="h-4 w-4" />
  </button>

  {/* <button
    onClick={() => onChangePlan(sub)}
    className="p-1.5 rounded-md hover:bg-muted transition-colors"
    title="Change Plan"
  >
    <Repeat className="h-4 w-4" />
  </button>

  <button
    onClick={() => onRefund(sub)}
    className="p-1.5 rounded-md hover:bg-muted transition-colors"
    title="Refund Last Payment"
  >
    <DollarSign className="h-4 w-4" />
  </button>

  <button
    onClick={() => onCancel(sub)}
    className="p-1.5 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
    title="Cancel Subscription"
  >
    <Ban className="h-4 w-4" />
  </button> */}

                </TableCell>
                
      {/* rest of your cells stay the same */}
    </TableRow>
  ))}

          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}