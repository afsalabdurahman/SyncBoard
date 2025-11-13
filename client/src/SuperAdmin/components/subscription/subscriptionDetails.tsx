

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../Custom/ui/dialog"
import { Badge } from "../../../Custom/ui/badge"
import { Card, CardContent } from "../../../Custom/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar"
import { Calendar, CreditCard, DollarSign, Mail, User } from "lucide-react"
import type { Subscription } from "./subscriptionTable"

export function SubscriptionDetails({
  open,
  onOpenChange,
  sub,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  sub: Subscription | null
}) {
  if (!sub) return null

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
<DialogContent className="w-[500px] h-[600px] max-w-none overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Subscription Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Workspace */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={sub.workspace.avatar || "/placeholder.svg?height=48&width=48&query=workspace-avatar"}
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
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{sub.workspace.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{sub.workspace.ownerName}</span>
                    <Mail className="h-4 w-4 ml-2" />
                    <span>{sub.workspace.ownerEmail}</span>
                  </div>
                </div>
                <Badge variant="secondary">
                  {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)} ·{" "}
                  {sub.interval === "year" ? "Yearly" : "Monthly"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Billing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold text-gray-900">Billing</div>
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">
                    ${sub.amount.toLocaleString()} {sub.currency} {sub.interval === "month" ? "/mo" : "/yr"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    Renews on <span className="font-medium">{fmtDate(sub.currentPeriodEnd)}</span>
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    sub.status === "active"
                      ? "bg-green-100 text-green-800"
                      : sub.status === "trialing"
                        ? "bg-blue-100 text-blue-800"
                        : sub.status === "past_due"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                  }
                >
                  {sub.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold text-gray-900">Payment Method</div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="uppercase">{sub.paymentMethod.brand}</span>
                  <span>•••• {sub.paymentMethod.last4}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Expires {String(sub.paymentMethod.expMonth).padStart(2, "0")}/
                  {String(sub.paymentMethod.expYear).slice(-2)}
                </div>
                {sub.cancelAtPeriodEnd && <div className="text-sm text-red-600">Cancels at period end</div>}
              </CardContent>
            </Card>
          </div>

          {/* Invoices (mocked from subscription basics) */}
          <Card>
            <CardContent className="p-4">
              <div className="font-semibold text-gray-900 mb-3">Recent Invoices</div>
              <div className="space-y-2">
                {[0, 1, 2].map((i) => {
                  const date = new Date(sub.currentPeriodEnd)
                  date.setMonth(date.getMonth() - i)
                  return (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="text-gray-700">
                        INV-{sub.id.slice(-6).toUpperCase()}-{i + 1}
                      </div>
                      <div className="text-gray-500">{fmtDate(date.toISOString())}</div>
                      <div className="font-medium text-gray-900">
                        ${sub.amount.toLocaleString()} {sub.currency}
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Paid
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
